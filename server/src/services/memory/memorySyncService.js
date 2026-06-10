import Memory from '../../models/Memory.js';
import Project from '../../models/Project.js';
import Idea from '../../models/Idea.js';
import AgentSession from '../../models/AgentSession.js';
import { findByEntityRef } from './memoryService.js';

function buildProjectContent(project) {
  return [
    project.description,
    `Stato: ${project.status}`,
    `Priorità: ${project.priority}`,
    `Progresso: ${project.progress}%`,
    project.tags?.length ? `Tag: ${project.tags.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function buildIdeaContent(idea) {
  return [
    idea.content,
    `Categoria: ${idea.category}`,
    `Stato: ${idea.status}`,
    idea.starred ? 'Idea preferita' : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function buildConversationContent(session) {
  const userMessages = session.messages
    .filter((m) => m.role === 'user')
    .slice(-5)
    .map((m) => m.content);

  const assistantMessages = session.messages
    .filter((m) => m.role === 'assistant')
    .slice(-3)
    .map((m) => m.content);

  const parts = [];
  if (userMessages.length) parts.push('Domande utente:\n' + userMessages.join('\n---\n'));
  if (assistantMessages.length) parts.push('Risposte agente:\n' + assistantMessages.join('\n---\n'));
  return parts.join('\n\n') || 'Conversazione senza messaggi utente.';
}

export async function syncFromProject(project) {
  const content = buildProjectContent(project);
  const payload = {
    projectId: project._id,
    status: project.status,
    progress: project.progress,
    priority: project.priority,
  };

  const existing = await findByEntityRef('Project', project._id);

  if (existing) {
    return Memory.findByIdAndUpdate(
      existing._id,
      {
        title: project.name,
        content,
        summary: project.description?.substring(0, 200) || '',
        tags: project.tags || [],
        importance: project.priority === 'critical' ? 9 : project.priority === 'high' ? 7 : 5,
        source: 'sync',
        projectId: project._id,
        payload,
      },
      { new: true }
    );
  }

  return Memory.create({
    type: 'project',
    title: project.name,
    content,
    summary: project.description?.substring(0, 200) || '',
    tags: project.tags || [],
    importance: project.priority === 'critical' ? 9 : project.priority === 'high' ? 7 : 5,
    source: 'sync',
    provider: 'mind',
    refs: { entityType: 'Project', entityId: project._id },
    projectId: project._id,
    payload,
  });
}

export async function syncFromIdea(idea) {
  const content = buildIdeaContent(idea);
  const payload = {
    ideaId: idea._id,
    category: idea.category,
    status: idea.status,
    starred: idea.starred,
  };

  const existing = await findByEntityRef('Idea', idea._id);

  if (existing) {
    return Memory.findByIdAndUpdate(
      existing._id,
      {
        title: idea.title,
        content,
        summary: idea.content?.substring(0, 200) || '',
        importance: idea.starred ? 8 : 5,
        source: 'sync',
        payload,
      },
      { new: true }
    );
  }

  return Memory.create({
    type: 'idea',
    title: idea.title,
    content,
    summary: idea.content?.substring(0, 200) || '',
    tags: idea.tags || [],
    importance: idea.starred ? 8 : 5,
    source: 'sync',
    provider: 'mind',
    refs: { entityType: 'Idea', entityId: idea._id },
    payload,
  });
}

export async function syncFromSession(session) {
  const userMessageCount = session.messages.filter((m) => m.role === 'user').length;
  if (userMessageCount < 1) return null;

  const content = buildConversationContent(session);
  const payload = {
    sessionId: session._id,
    agentType: session.agentType,
    messageCount: session.messages.length,
    keyFacts: [],
    lastMessageAt: session.updatedAt,
  };

  const existing = await findByEntityRef('AgentSession', session._id);

  const data = {
    type: 'conversation',
    title: session.title || `Conversazione ${session.agentType}`,
    content,
    summary: content.substring(0, 250),
    importance: Math.min(5 + userMessageCount, 9),
    source: 'agent',
    provider: 'mind',
    refs: { entityType: 'AgentSession', entityId: session._id },
    payload,
  };

  if (existing) {
    return Memory.findByIdAndUpdate(existing._id, data, { new: true });
  }

  return Memory.create(data);
}

export async function syncAll() {
  const [projects, ideas, sessions] = await Promise.all([
    Project.find().lean(),
    Idea.find().lean(),
    AgentSession.find().lean(),
  ]);

  const results = { projects: 0, ideas: 0, conversations: 0 };

  for (const project of projects) {
    await syncFromProject(project);
    results.projects += 1;
  }

  for (const idea of ideas) {
    await syncFromIdea(idea);
    results.ideas += 1;
  }

  for (const session of sessions) {
    const synced = await syncFromSession(session);
    if (synced) results.conversations += 1;
  }

  return results;
}
