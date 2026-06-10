import Activity from '../models/Activity.js';

export async function logActivity({ type, title, description = '', metadata = {}, entityType, entityId }) {
  try {
    await Activity.create({ type, title, description, metadata, entityType, entityId });
  } catch (error) {
    console.error('Errore log attività:', error.message);
  }
}
