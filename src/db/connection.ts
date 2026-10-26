import mongoose from "mongoose";

const DEFAULT_URI = "mongodb://127.0.0.1:27017/library";

/**
 * Opens the Mongoose connection. Safe to call multiple times — Mongoose
 * is a singleton and will no-op if already connected.
 */
export async function connectDB(uri: string = DEFAULT_URI): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    // Already connected or connecting
    return;
  }
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

/**
 * Closes the Mongoose connection. Useful for graceful shutdown and tests.
 */
export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}