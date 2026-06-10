import mongoose from 'mongoose';

const memoryLinkSchema = new mongoose.Schema(
  {
    fromMemoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Memory',
      required: true,
      index: true,
    },
    toMemoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Memory',
      required: true,
      index: true,
    },
    relation: {
      type: String,
      enum: ['related', 'derived', 'mentions'],
      default: 'related',
    },
  },
  { timestamps: true }
);

memoryLinkSchema.index({ fromMemoryId: 1, toMemoryId: 1 }, { unique: true });

export default mongoose.model('MemoryLink', memoryLinkSchema);
