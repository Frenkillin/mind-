import Memory, { MEMORY_TYPES } from '../../models/Memory.js';

export function buildListFilter(query = {}) {
  const filter = {};

  if (query.type && MEMORY_TYPES.includes(query.type)) {
    filter.type = query.type;
  }

  if (query.pinned === 'true') {
    filter.pinned = true;
  }

  if (query.tag) {
    filter.tags = query.tag;
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.minImportance) {
    filter.importance = { $gte: parseInt(query.minImportance, 10) };
  }

  return filter;
}

export async function listMemories(query = {}) {
  const filter = buildListFilter(query);
  const limit = Math.min(parseInt(query.limit || '50', 10), 100);
  const skip = parseInt(query.skip || '0', 10);

  const [items, total] = await Promise.all([
    Memory.find(filter)
      .sort({ pinned: -1, importance: -1, updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Memory.countDocuments(filter),
  ]);

  return { items, total, limit, skip };
}

export async function getMemoryById(id) {
  return Memory.findById(id).lean();
}

export async function createMemory(data) {
  return Memory.create(data);
}

export async function updateMemory(id, data) {
  return Memory.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteMemory(id) {
  return Memory.findByIdAndDelete(id).lean();
}

export async function recordAccess(id) {
  return Memory.findByIdAndUpdate(
    id,
    { $inc: { accessCount: 1 }, lastAccessedAt: new Date() },
    { new: true }
  ).lean();
}

export async function getMemoryStats() {
  const [total, byType, pinned, highImportance] = await Promise.all([
    Memory.countDocuments(),
    Memory.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
    Memory.countDocuments({ pinned: true }),
    Memory.countDocuments({ importance: { $gte: 8 } }),
  ]);

  const typeCounts = MEMORY_TYPES.reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {});

  byType.forEach(({ _id, count }) => {
    if (_id) typeCounts[_id] = count;
  });

  return { total, byType: typeCounts, pinned, highImportance };
}

export async function findByEntityRef(entityType, entityId) {
  return Memory.findOne({
    'refs.entityType': entityType,
    'refs.entityId': entityId,
  });
}
