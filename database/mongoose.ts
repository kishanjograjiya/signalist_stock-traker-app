import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async (): Promise<typeof mongoose> => {
  if (!MONGODB_URI)
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env"
    );

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  console.log(
    `MongoDB connected [env=${process.env.NODE_ENV}, db="${cached.conn.connection.name}", host="${cached.conn.connection.host}"]`
  );

  return cached.conn;
};
