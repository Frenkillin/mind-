import Agent from '../../models/Agent.js';

const DEFAULT_AGENTS = [
  {
    name: 'Business Agent',
    slug: 'business',
    role: 'Strategia e business',
    provider: 'gemini',
    capabilities: ['pianificazione', 'analisi mercato', 'finanza', 'decisioni'],
    color: '#3b82f6',
    icon: 'briefcase',
    description: 'Strategia, pianificazione e analisi di business',
  },
  {
    name: 'Development Agent',
    slug: 'development',
    role: 'Sviluppo software',
    provider: 'gemini',
    capabilities: ['architettura', 'codice', 'debugging', 'devops'],
    color: '#06b6d4',
    icon: 'code',
    description: 'Architettura software, codice e debugging',
  },
  {
    name: 'Marketing Agent',
    slug: 'marketing',
    role: 'Marketing e crescita',
    provider: 'gemini',
    capabilities: ['contenuti', 'campagne', 'seo', 'branding'],
    color: '#8b5cf6',
    icon: 'megaphone',
    description: 'Contenuti, campagne e crescita',
  },
  {
    name: 'Research Agent',
    slug: 'research',
    role: 'Ricerca e analisi',
    provider: 'gemini',
    capabilities: ['ricerca', 'analisi dati', 'report', 'trend'],
    color: '#10b981',
    icon: 'search',
    description: 'Ricerca, analisi dati e approfondimenti',
  },
];

export async function seedDefaultAgents() {
  const count = await Agent.countDocuments();
  if (count > 0) return { seeded: false, count };

  await Agent.insertMany(DEFAULT_AGENTS);
  return { seeded: true, count: DEFAULT_AGENTS.length };
}
