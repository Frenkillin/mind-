import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mind',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiEnabled: process.env.OPENAI_ENABLED === 'true',
  githubToken: process.env.GITHUB_TOKEN || '',
  githubUsername: process.env.GITHUB_USERNAME || '',
  replitApiKey: process.env.REPLIT_API_KEY || '',
  voiceEnabled: process.env.VOICE_ENABLED === 'true',
};
