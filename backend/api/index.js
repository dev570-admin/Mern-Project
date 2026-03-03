let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI missing");
    return null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongoose) => {
        console.log("✅ MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB error:", err.message);
        cached.promise = null; // reset
        return null;           // ❗ DO NOT throw
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
