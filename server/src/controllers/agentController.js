import AgentSession from '../models/AgentSession.js';
import Agent from '../models/Agent.js';
import { AgentFactory } from '../services/agents/AgentFactory.js';
import { logActivity } from '../utils/activityLogger.js';
import { syncFromSession } from '../services/memory/memorySyncService.js';

async function resolveAgentType({ agentType, agentId }) {
  if (agentId) {
    const agent = await Agent.findById(agentId);
    if (agent?.slug) return agent.slug;
  }
  return agentType || 'business';
}

export async function getSessions(req, res) {
  const filter = {};
  if (req.query.agentType) filter.agentType = req.query.agentType;

  const sessions = await AgentSession.find(filter).sort({ updatedAt: -1 }).limit(20);
  res.json({ success: true, data: sessions });
}

export async function getSession(req, res) {
  const session = await AgentSession.findById(req.params.id);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Sessione non trovata' });
  }
  res.json({ success: true, data: session });
}

export async function createSession(req, res) {
  const { agentType, agentId, title } = req.body;
  const resolvedType = await resolveAgentType({ agentType, agentId });
  const dbAgent = agentId
    ? await Agent.findById(agentId)
    : await Agent.findOne({ slug: resolvedType });

  const agent = AgentFactory.create(resolvedType);

  const session = await AgentSession.create({
    agentType: resolvedType,
    title: title || `Conversazione ${dbAgent?.name || resolvedType}`,
    messages: [{ role: 'system', content: agent.getSystemPrompt() }],
    context: { agentId: dbAgent?._id },
  });

  res.status(201).json({ success: true, data: session });
}

export async function sendMessage(req, res) {
  const { message } = req.body;
  const session = await AgentSession.findById(req.params.id);

  if (!session) {
    return res.status(404).json({ success: false, error: 'Sessione non trovata' });
  }

  session.messages.push({ role: 'user', content: message });

  const agent = AgentFactory.create(session.agentType);
  const response = await agent.processMessage(message, session.messages);

  session.messages.push({ role: 'assistant', content: response });
  await session.save();

  const dbAgent = await Agent.findOne({ slug: session.agentType });

  await logActivity({
    type: 'agent_interaction',
    title: `Interazione con ${dbAgent?.name || session.agentType}`,
    description: message.substring(0, 100),
    metadata: { agentType: session.agentType, sessionId: session._id },
  });

  const userMessageCount = session.messages.filter((m) => m.role === 'user').length;
  if (userMessageCount % 3 === 0) {
    await syncFromSession(session).catch(() => {});
  }

  res.json({
    success: true,
    data: {
      message: response,
      session,
    },
  });
}

export async function deleteSession(req, res) {
  const session = await AgentSession.findByIdAndDelete(req.params.id);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Sessione non trovata' });
  }
  res.json({ success: true, data: session });
}
