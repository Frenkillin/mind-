import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    targetDate: { type: Date },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    category: {
      type: String,
      enum: ['personal', 'business', 'learning', 'health', 'other'],
      default: 'personal',
    },
    milestones: [
      {
        title: String,
        completed: { type: Boolean, default: false },
        completedAt: Date,
      },
    ],
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Goal', goalSchema);
