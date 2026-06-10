import mongoose from 'mongoose';

export const TASK_STATUSES = ['todo', 'doing', 'review', 'done'];

const taskSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: 'todo',
    },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', default: null },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    // Legacy — mantenuto per compatibilità
    agentType: {
      type: String,
      enum: ['business', 'development', 'marketing', 'research', null],
      default: null,
    },
  },
  { timestamps: true }
);

taskSchema.virtual('completed').get(function () {
  return this.status === 'done';
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

taskSchema.index({ status: 1, projectId: 1 });

export default mongoose.model('Task', taskSchema);
