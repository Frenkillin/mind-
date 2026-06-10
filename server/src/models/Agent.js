import mongoose from 'mongoose';

export const AGENT_PROVIDERS = ['gemini', 'claude', 'openai'];

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    provider: {
      type: String,
      enum: AGENT_PROVIDERS,
      default: 'gemini',
    },
    role: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, unique: true, sparse: true },
    capabilities: [{ type: String, trim: true }],
    active: { type: Boolean, default: true },
    color: { type: String, default: '#3b82f6' },
    icon: { type: String, default: 'bot' },
    description: { type: String, default: '' },
    // Scaffold esecuzione autonoma futura
    executionConfig: {
      canReceiveTasks: { type: Boolean, default: true },
      canUseMemory: { type: Boolean, default: true },
      canWorkAutonomously: { type: Boolean, default: false },
      preferredProvider: { type: String, enum: AGENT_PROVIDERS, default: 'gemini' },
    },
  },
  { timestamps: true }
);

agentSchema.index({ active: 1 });
agentSchema.index({ provider: 1 });

export default mongoose.model('Agent', agentSchema);
