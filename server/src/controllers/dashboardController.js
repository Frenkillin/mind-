import { buildDashboardPayload } from '../services/dashboardService.js';

export async function getDashboard(_req, res) {
  const data = await buildDashboardPayload();
  res.json({ success: true, data });
}
