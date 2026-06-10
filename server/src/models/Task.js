import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    dueDate: { type: Date },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    agentType: {
      type: String,
      enum: ['business', 'development', 'marketing', 'research', null],
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
