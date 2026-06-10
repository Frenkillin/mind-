import Activity from '../models/Activity.js';

export async function getActivities(req, res) {
  const limit = parseInt(req.query.limit || '50', 10);
  const activities = await Activity.find()
    .sort({ createdAt: -1 })
    .limit(limit);
  res.json({ success: true, data: activities });
}
