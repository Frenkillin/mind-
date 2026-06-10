export const MEMORY_TYPES = [
  { id: 'all', label: 'Tutte' },
  { id: 'conversation', label: 'Conversazioni', color: '#3b82f6' },
  { id: 'project', label: 'Progetti', color: '#06b6d4' },
  { id: 'idea', label: 'Idee', color: '#10b981' },
  { id: 'document', label: 'Documenti', color: '#8b5cf6' },
  { id: 'contact', label: 'Contatti', color: '#f59e0b' },
];

export const MEMORY_TYPE_MAP = Object.fromEntries(
  MEMORY_TYPES.filter((t) => t.id !== 'all').map((t) => [t.id, t])
);

export const SOURCE_LABELS = {
  manual: 'Manuale',
  agent: 'Agente',
  sync: 'Sincronizzato',
  import: 'Importato',
  mcp: 'MCP',
};
