import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'project_created',
        'project_updated',
        'task_completed',
        'task_created',
        'idea_saved',
        'goal_updated',
        'note_created',
        'agent_interaction',
        'integration_used',
      ],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    entityType: { type: String },
    entityId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

activitySchema.index({ createdAt: -1 });

export default mongoose.model('Activity', activitySchema);
