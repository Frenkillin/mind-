import mongoose from 'mongoose';

export const PROJECT_STATUSES = ['idea', 'planning', 'development', 'testing', 'completed'];
export const PROJECT_PRIORITIES = ['low', 'medium', 'high', 'critical'];

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: 'idea',
    },
    priority: {
      type: String,
      enum: PROJECT_PRIORITIES,
      default: 'medium',
    },
    tags: [{ type: String, trim: true }],
    color: { type: String, default: '#3b82f6' },
    deadline: { type: Date },
    progress: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

projectSchema.virtual('title').get(function () {
  return this.name;
});

projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

projectSchema.index({ name: 'text', description: 'text' });
projectSchema.index({ status: 1, updatedAt: -1 });

export default mongoose.model('Project', projectSchema);
