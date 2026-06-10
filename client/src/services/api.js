const BASE = '/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Errore nella richiesta');
  }

  return data;
}

export const api = {
  dashboard: {
    get: () => request('/dashboard'),
  },
  projects: {
    list: () => request('/projects'),
    get: (id) => request(`/projects/${id}`),
    create: (body) => request('/projects', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  },
  tasks: {
    list: (params = '') => request(`/tasks${params}`),
    create: (body) => request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  },
  goals: {
    list: (params = '') => request(`/goals${params}`),
    create: (body) => request('/goals', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/goals/${id}`, { method: 'DELETE' }),
  },
  notes: {
    list: () => request('/notes'),
    create: (body) => request('/notes', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
  },
  ideas: {
    list: (params = '') => request(`/ideas${params}`),
    create: (body) => request('/ideas', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/ideas/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/ideas/${id}`, { method: 'DELETE' }),
  },
  activities: {
    list: (limit = 50) => request(`/activities?limit=${limit}`),
  },
  agents: {
    list: () => request('/agents'),
    sessions: (agentType) => request(`/agents/sessions${agentType ? `?agentType=${agentType}` : ''}`),
    getSession: (id) => request(`/agents/sessions/${id}`),
    createSession: (body) => request('/agents/sessions', { method: 'POST', body: JSON.stringify(body) }),
    sendMessage: (id, message) =>
      request(`/agents/sessions/${id}/message`, { method: 'POST', body: JSON.stringify({ message }) }),
    deleteSession: (id) => request(`/agents/sessions/${id}`, { method: 'DELETE' }),
  },
  integrations: {
    status: () => request('/integrations/status'),
  },
};
