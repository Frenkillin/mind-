import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    category: {
      type: String,
      enum: ['business', 'development', 'marketing', 'research', 'general'],
      default: 'general',
    },
    status: {
      type: String,
      enum: ['draft', 'exploring', 'validated', 'implemented', 'discarded'],
      default: 'draft',
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    tags: [{ type: String, trim: true }],
    starred: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Idea', ideaSchema);
