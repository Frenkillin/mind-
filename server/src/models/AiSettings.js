import mongoose from 'mongoose';

export const AI_PROVIDERS = ['gemini', 'claude', 'openai'];
export const DEFAULT_AI_PROVIDER = 'gemini';

const aiSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'global', unique: true },
    activeProvider: {
      type: String,
      enum: AI_PROVIDERS,
      default: DEFAULT_AI_PROVIDER,
    },
  },
  { timestamps: true }
);

export default mongoose.model('AiSettings', aiSettingsSchema);
