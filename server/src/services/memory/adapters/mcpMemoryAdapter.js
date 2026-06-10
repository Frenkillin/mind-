export function getMcpToolDefinitions() {
  return [
    {
      name: 'memory_store',
      description: 'Store a new permanent memory in MIND',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['conversation', 'project', 'idea', 'document', 'contact'] },
          title: { type: 'string' },
          content: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          importance: { type: 'number', minimum: 1, maximum: 10 },
        },
        required: ['type', 'title', 'content'],
      },
    },
    {
      name: 'memory_search',
      description: 'Search permanent memories in MIND',
      inputSchema: {
        type: 'object',
        properties: {
          q: { type: 'string' },
          type: { type: 'string' },
          limit: { type: 'number' },
        },
        required: ['q'],
      },
    },
    {
      name: 'memory_get',
      description: 'Retrieve a specific memory by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
  ];
}

export async function handleMcpToolCall(toolName, _args) {
  return {
    tool: toolName,
    status: 'scaffold',
    message: 'MCP memory tools are defined but not yet connected to a live MCP server.',
  };
}
