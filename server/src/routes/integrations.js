import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { claudeService } from '../services/integrations/claude.js';
import { openaiService } from '../services/integrations/openai.js';
import { githubService } from '../services/integrations/github.js';
import { replitService } from '../services/integrations/replit.js';
import { voiceService } from '../services/integrations/voice.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/status', (_req, res) => {
  res.json({
    success: true,
    data: {
      claude: claudeService.isConfigured(),
      openai: openaiService.isConfigured(),
      github: githubService.isConfigured(),
      replit: replitService.isConfigured(),
      voice: env.voiceEnabled,
    },
  });
});

router.post('/claude/chat', asyncHandler(async (req, res) => {
  const { messages, system } = req.body;
  const response = await claudeService.chat(messages, system);
  res.json({ success: true, data: response });
}));

router.post('/openai/chat', asyncHandler(async (req, res) => {
  const { messages, system } = req.body;
  const response = await openaiService.chat(messages, system);
  res.json({ success: true, data: response });
}));

router.get('/github/repos', asyncHandler(async (_req, res) => {
  const repos = await githubService.listRepos();
  res.json({ success: true, data: repos });
}));

router.get('/replit/repls', asyncHandler(async (_req, res) => {
  const repls = await replitService.listRepls();
  res.json({ success: true, data: repls });
}));

router.get('/voice/status', (_req, res) => {
  res.json({ success: true, data: voiceService.getStatus() });
});

export default router;
