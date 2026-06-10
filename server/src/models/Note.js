import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    pinned: { type: Boolean, default: false },
    color: { type: String, default: '#1e3a5f' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  },
  { timestamps: true }
);

export default mongoose.model('Note', noteSchema);
