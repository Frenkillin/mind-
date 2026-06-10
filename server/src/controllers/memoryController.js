import {
  listMemories,
  getMemoryById,
  createMemory,
  updateMemory,
  deleteMemory,
  recordAccess,
  getMemoryStats,
} from '../services/memory/memoryService.js';
import { searchMemories } from '../services/memory/memorySearchService.js';
import { buildContext } from '../services/memory/memoryRetrievalService.js';
import { syncAll } from '../services/memory/memorySyncService.js';

export async function getMemories(req, res) {
  const data = await listMemories(req.query);
  res.json({ success: true, data });
}

export async function getMemoryStatsHandler(_req, res) {
  const stats = await getMemoryStats();
  res.json({ success: true, data: stats });
}

export async function searchMemory(req, res) {
  const data = await searchMemories({
    q: req.query.q,
    type: req.query.type,
    tag: req.query.tag,
    limit: req.query.limit,
  });
  res.json({ success: true, data });
}

export async function getMemoryContext(req, res) {
  const types = req.query.types ? req.query.types.split(',') : undefined;
  const data = await buildContext({
    types,
    limit: req.query.limit,
    minImportance: req.query.minImportance,
  });
  res.json({ success: true, data });
}

export async function getMemory(req, res) {
  const memory = await getMemoryById(req.params.id);
  if (!memory) {
    return res.status(404).json({ success: false, error: 'Memoria non trovata' });
  }
  res.json({ success: true, data: memory });
}

export async function createMemoryHandler(req, res) {
  const memory = await createMemory(req.body);
  res.status(201).json({ success: true, data: memory });
}

export async function updateMemoryHandler(req, res) {
  const memory = await updateMemory(req.params.id, req.body);
  if (!memory) {
    return res.status(404).json({ success: false, error: 'Memoria non trovata' });
  }
  res.json({ success: true, data: memory });
}

export async function deleteMemoryHandler(req, res) {
  const memory = await deleteMemory(req.params.id);
  if (!memory) {
    return res.status(404).json({ success: false, error: 'Memoria non trovata' });
  }
  res.json({ success: true, data: memory });
}

export async function recordMemoryAccess(req, res) {
  const memory = await recordAccess(req.params.id);
  if (!memory) {
    return res.status(404).json({ success: false, error: 'Memoria non trovata' });
  }
  res.json({ success: true, data: memory });
}

export async function syncMemories(_req, res) {
  const results = await syncAll();
  res.json({ success: true, data: results });
}
