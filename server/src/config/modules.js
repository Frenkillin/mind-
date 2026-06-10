/**
 * Registry dei moduli MIND — centro di controllo progetti.
 * status: active | scaffold | planned
 */
export const MIND_MODULES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Centro di controllo e panoramica generale',
    status: 'active',
    route: '/',
    icon: 'layout-dashboard',
  },
  {
    id: 'memory',
    name: 'Memoria persistente',
    description: 'Cronologia, contesto e dati persistenti',
    status: 'active',
    route: '/memory',
    icon: 'brain',
  },
  {
    id: 'projects',
    name: 'Gestione progetti',
    description: 'Crea, monitora e organizza i progetti',
    status: 'active',
    route: '/projects',
    icon: 'folder-kanban',
  },
  {
    id: 'tasks',
    name: 'Gestione task',
    description: 'Attività, priorità e scadenze',
    status: 'active',
    route: '/tasks',
    icon: 'check-square',
  },
  {
    id: 'documents',
    name: 'Archivio documenti',
    description: 'File, note e documentazione centralizzata',
    status: 'planned',
    route: '/documents',
    icon: 'file-archive',
  },
  {
    id: 'chat',
    name: 'Chat AI con memoria',
    description: 'Conversazioni contestuali con memoria',
    status: 'scaffold',
    route: '/agents',
    icon: 'message-square',
  },
  {
    id: 'voice',
    name: 'Controllo vocale',
    description: 'Comandi vocali e input speech-to-text',
    status: 'scaffold',
    route: '/settings',
    icon: 'mic',
  },
  {
    id: 'mcp',
    name: 'Sistema MCP',
    description: 'Model Context Protocol e tool esterni',
    status: 'planned',
    route: '/mcp',
    icon: 'plug',
  },
  {
    id: 'github',
    name: 'Collegamento GitHub',
    description: 'Repository, issue e sincronizzazione codice',
    status: 'scaffold',
    route: '/settings',
    icon: 'github',
  },
  {
    id: 'replit',
    name: 'Collegamento Replit',
    description: 'Repl, deploy e sviluppo cloud',
    status: 'scaffold',
    route: '/settings',
    icon: 'cloud',
  },
];

export function getModuleStats() {
  const total = MIND_MODULES.length;
  const active = MIND_MODULES.filter((m) => m.status === 'active').length;
  const scaffold = MIND_MODULES.filter((m) => m.status === 'scaffold').length;
  const planned = MIND_MODULES.filter((m) => m.status === 'planned').length;
  return { total, active, scaffold, planned };
}
