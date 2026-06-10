import Memory from '../../models/Memory.js';
import { buildListFilter } from './memoryService.js';

export async function searchMemories({ q, type, tag, limit = 20 }) {
  const filter = buildListFilter({ type, tag });
  const maxLimit = Math.min(parseInt(limit, 10) || 20, 50);

  if (!q || !q.trim()) {
    const items = await Memory.find(filter)
      .sort({ pinned: -1, importance: -1, updatedAt: -1 })
      .limit(maxLimit)
      .lean();
    return { items, query: '', mode: 'filter' };
  }

  const query = q.trim();

  try {
    const textResults = await Memory.find(
      { ...filter, $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(maxLimit)
      .lean();

    if (textResults.length > 0) {
      return { items: textResults, query, mode: 'text' };
    }
  } catch {
    // Text index may not exist yet on first run
  }

  const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const items = await Memory.find({
    ...filter,
    $or: [{ title: regex }, { content: regex }, { summary: regex }, { tags: regex }],
  })
    .sort({ importance: -1, updatedAt: -1 })
    .limit(maxLimit)
    .lean();

  return { items, query, mode: 'regex' };
}
