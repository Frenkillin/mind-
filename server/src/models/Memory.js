import mongoose from 'mongoose';

export const MEMORY_TYPES = ['conversation', 'project', 'idea', 'document', 'contact'];
export const MEMORY_SOURCES = ['manual', 'agent', 'sync', 'import', 'mcp'];
export const MEMORY_PROVIDERS = ['mind', 'gemini', 'claude', 'openai', 'mcp'];

const refsSchema = new mongoose.Schema(
  {
    entityType: { type: String },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    externalId: { type: String },
  },
  { _id: false }
);

const memorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: MEMORY_TYPES,
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    summary: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    importance: { type: Number, min: 1, max: 10, default: 5 },
    source: {
      type: String,
      enum: MEMORY_SOURCES,
      default: 'manual',
    },
    provider: {
      type: String,
      enum: [...MEMORY_PROVIDERS, null],
      default: 'mind',
    },
    pinned: { type: Boolean, default: false },
    refs: { type: refsSchema, default: () => ({}) },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    embedding: { type: [Number], default: [] },
    accessCount: { type: Number, default: 0 },
    lastAccessedAt: { type: Date },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

memorySchema.index({ type: 1, createdAt: -1 });
memorySchema.index({ tags: 1 });
memorySchema.index({ pinned: -1, importance: -1 });
memorySchema.index({ 'refs.entityId': 1, 'refs.entityType': 1 });
memorySchema.index({ title: 'text', content: 'text', summary: 'text' });

export default mongoose.model('Memory', memorySchema);
