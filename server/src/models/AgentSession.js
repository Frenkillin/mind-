import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const agentSessionSchema = new mongoose.Schema(
  {
    agentType: {
      type: String,
      enum: ['business', 'development', 'marketing', 'research'],
      required: true,
    },
    title: { type: String, default: 'Nuova conversazione' },
    messages: [messageSchema],
    context: { type: mongoose.Schema.Types.Mixed, default: {} },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('AgentSession', agentSessionSchema);
