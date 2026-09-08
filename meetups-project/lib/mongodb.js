import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI in your .env file");
}

// Keep the connection between Next.js API requests and hot reloads.
const cached = global.mongoose || {
  conn: null,
  promise: null,
  uri: null,
};

global.mongoose = cached;

const connectDB = async () => {
  // Reuse the existing connection when the URI has not changed.
  if (cached.conn && cached.uri === MONGO_URI) {
    return cached.conn;
  }

  // Reuse a connection that is still being opened.
  if (cached.promise && cached.uri === MONGO_URI) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  // The .env URI changed, so close the old connection first.
  if (cached.conn || cached.promise) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }

  // Start connecting and save the promise so other requests can share it.
  cached.uri = MONGO_URI;
  cached.promise = mongoose.connect(MONGO_URI);

  try {
    // Wait until MongoDB is ready, then save the connection for reuse.
    cached.conn = await cached.promise;
    console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
    return cached.conn;
  } catch (error) {
    // Clear failed connection details so the next request can retry.
    cached.promise = null;
    cached.uri = null;
    throw error;
  }
};

export default connectDB;
