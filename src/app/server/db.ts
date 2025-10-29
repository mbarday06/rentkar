import mongoose from "mongoose";

export async function connectMongo() {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI

  if (!uri) {
    throw new Error("❌ No MongoDB URI found in environment variables");
  }

  try {
    const conn = await mongoose.connect(uri, {
      appName: "rentkar",
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
