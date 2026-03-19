import mongoose from "mongoose";

/*
 * Serverless-safe Mongoose connection with caching.
 *
 * On Vercel each function invocation may reuse a warm container or spin up
 * a cold one. Without caching, every cold start opens a brand-new connection
 * and your MongoDB Atlas free tier will hit its connection limit fast.
 *
 * This pattern stores the connection on the Node.js `global` object so it
 * survives across invocations within the same container.
 */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connection() {
  // Return existing connection immediately if available
  if (cached.conn) {
    return cached.conn;
  }

  // If no in-flight connection promise exists, start one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail fast instead of queuing commands
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected");
        return mongooseInstance;
      })
      .catch((err) => {
        // Reset promise so the next request can retry
        cached.promise = null;
        throw err;
      });
  }

  // Await the in-flight promise and cache the result
  cached.conn = await cached.promise;
  return cached.conn;
}
