import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('✓ MongoDB connesso');
  } catch (error) {
    console.error('✗ Errore connessione MongoDB:', error.message);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnesso');
});
