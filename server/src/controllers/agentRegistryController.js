import Agent from '../models/Agent.js';
import { createExecutor } from '../services/agents/agentExecutor.js';

export async function listAgents(req, res) {
  const filter = {};
  if (req.query.active !== undefined) filter.active = req.query.active === 'true';
  if (req.query.provider) filter.provider = req.query.provider;

  const agents = await Agent.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: agents });
}

export async function getAgent(req, res) {
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    return res.status(404).json({ success: false, error: 'Agente non trovato' });
  }
  res.json({ success: true, data: agent });
}

export async function createAgent(req, res) {
  const agent = await Agent.create(req.body);
  res.status(201).json({ success: true, data: agent });
}

export async function updateAgent(req, res) {
  const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!agent) {
    return res.status(404).json({ success: false, error: 'Agente non trovato' });
  }
  res.json({ success: true, data: agent });
}

export async function deleteAgent(req, res) {
  const agent = await Agent.findByIdAndDelete(req.params.id);
  if (!agent) {
    return res.status(404).json({ success: false, error: 'Agente non trovato' });
  }
  res.json({ success: true, data: agent });
}

export async function getAgentExecutionScaffold(req, res) {
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    return res.status(404).json({ success: false, error: 'Agente non trovato' });
  }

  const executor = createExecutor(agent);
  res.json({
    success: true,
    data: {
      agent,
      executionConfig: agent.executionConfig,
      capabilities: {
        receiveTasks: agent.executionConfig?.canReceiveTasks ?? true,
        useGemini: agent.provider === 'gemini',
        consultMemory: agent.executionConfig?.canUseMemory ?? true,
        workAutonomously: agent.executionConfig?.canWorkAutonomously ?? false,
      },
      status: 'scaffold_ready',
      message: 'Struttura pronta per esecuzione autonoma futura',
      executor: typeof executor.prepareTaskContext === 'function',
    },
  });
}
