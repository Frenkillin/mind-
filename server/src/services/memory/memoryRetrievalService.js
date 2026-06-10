import Memory, { MEMORY_TYPES } from '../../models/Memory.js';
import { formatForGemini } from './adapters/geminiMemoryAdapter.js';
import { formatForClaude } from './adapters/claudeMemoryAdapter.js';
import { formatForOpenAI } from './adapters/openaiMemoryAdapter.js';
import { getMcpToolDefinitions } from './adapters/mcpMemoryAdapter.js';
import { geminiService } from '../integrations/gemini.js';
import { claudeService } from '../integrations/claude.js';
import { openaiService } from '../integrations/openai.js';
import { getActiveProvider } from '../ai/aiProviderManager.js';

function estimateTokens(text) {
  return Math.ceil((text || '').length / 4);
}

export async function buildContext(options = {}) {
  const types = options.types?.length
    ? options.types.filter((t) => MEMORY_TYPES.includes(t))
    : MEMORY_TYPES;
  const limit = Math.min(parseInt(options.limit || '10', 10), 30);
  const minImportance = parseInt(options.minImportance || '1', 10);

  const memories = await Memory.find({
    type: { $in: types },
    importance: { $gte: minImportance },
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  })
    .sort({ pinned: -1, importance: -1, lastAccessedAt: -1, updatedAt: -1 })
    .limit(limit)
    .lean();

  const memoryBlocks = memories.map((m) => ({
    id: m._id,
    type: m.type,
    title: m.title,
    content: m.content,
    summary: m.summary,
    importance: m.importance,
    tags: m.tags,
    source: m.source,
  }));

  const systemContext = [
    '=== CONTESTO MEMORIA PERMANENTE MIND ===',
    `Memorie recuperate: ${memoryBlocks.length}`,
    '',
    ...memoryBlocks.map(
      (m, i) =>
        `[${i + 1}] (${m.type.toUpperCase()}) ${m.title}\n` +
        `${m.summary || m.content}\n` +
        (m.tags?.length ? `Tag: ${m.tags.join(', ')}\n` : '')
    ),
    '=== FINE CONTESTO ===',
  ].join('\n');

  const tokenEstimate = estimateTokens(systemContext);
  const activeProvider = await getActiveProvider();

  return {
    systemContext,
    memories: memoryBlocks,
    tokenEstimate,
    activeProvider,
    providers: {
      gemini: {
        ready: geminiService.isConfigured(),
        isDefault: true,
        formatted: formatForGemini(memoryBlocks),
      },
      claude: {
        ready: claudeService.isConfigured(),
        formatted: formatForClaude(memoryBlocks),
      },
      openai: {
        ready: openaiService.isConfigured(),
        enabled: openaiService.isEnabled(),
        formatted: formatForOpenAI(memoryBlocks),
      },
      mcp: {
        ready: false,
        tools: getMcpToolDefinitions(),
      },
    },
  };
}
