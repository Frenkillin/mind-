import AgentSession from '../models/AgentSession.js';
import { AgentFactory } from '../services/agents/AgentFactory.js';
import { logActivity } from '../utils/activityLogger.js';

const AGENT_INFO = {
  business: {
    name: 'Business Agent',
    description: 'Strategia, pianificazione e analisi di business',
    icon: 'briefcase',
    color: '#3b82f6',
  },
  development: {
    name: 'Development Agent',
    description: 'Architettura software, codice e debugging',
    icon: 'code',
    color: '#06b6d4',
  },
  marketing: {
    name: 'Marketing Agent',
    description: 'Contenuti, campagne e crescita',
    icon: 'megaphone',
    color: '#8b5cf6',
  },
  research: {
    name: 'Research Agent',
    description: 'Ricerca, analisi dati e approfondimenti',
    icon: 'search',
    color: '#10b981',
  },
};

export async function getAgents(_req, res) {
  res.json({
    success: true,
    data: Object.entries(AGENT_INFO).map(([type, info]) => ({ type, ...info })),
  });
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
  const { agentType, title } = req.body;
  const agent = AgentFactory.create(agentType);

  const session = await AgentSession.create({
    agentType,
    title: title || `Conversazione ${AGENT_INFO[agentType]?.name || agentType}`,
    messages: [{ role: 'system', content: agent.getSystemPrompt() }],
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

  await logActivity({
    type: 'agent_interaction',
    title: `Interazione con ${AGENT_INFO[session.agentType]?.name}`,
    description: message.substring(0, 100),
    metadata: { agentType: session.agentType, sessionId: session._id },
  });

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
