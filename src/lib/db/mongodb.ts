import mongoose from "mongoose";
import { getMongoUri } from "@/lib/env";

/**
 * Global cache interface to prevent multiple connections in Next.js
 * development / hot-reload environments.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export class DatabaseError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code = "DATABASE_ERROR", statusCode = 503) {
    super(message);
    this.name = "DatabaseError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Connects to MongoDB with caching and crash prevention.
 * Throws DatabaseError if URI is missing or connection fails.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = getMongoUri();

  if (!uri) {
    throw new DatabaseError(
      "متغیر MONGODB_URI تنظیم نشده است. لطفاً فایل .env.local را بررسی کنید.",
      "MISSING_MONGODB_URI",
      500,
    );
  }

  // If already connected and ready, return existing connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection is in progress, await it
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Don't let queries hang indefinitely if offline
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
      connectTimeoutMS: 5000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        return m;
      })
      .catch((err) => {
        // Reset promise on error so subsequent requests can retry
        cached.promise = null;
        throw new DatabaseError(
          `خطا در اتصال به پایگاه داده: ${err instanceof Error ? err.message : String(err)}`,
          "DATABASE_CONNECTION_FAILED",
          503,
        );
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `خطای ناشناخته در پایگاه داده: ${error instanceof Error ? error.message : String(error)}`,
      "DATABASE_UNKNOWN_ERROR",
      503,
    );
  }
}

/**
 * Helper to check current database health without throwing.
 */
export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  readyState: number;
  error?: string;
}> {
  try {
    const readyState = mongoose.connection.readyState;
    if (readyState === 1) {
      return { connected: true, readyState: 1 };
    }
    await connectToDatabase();
    return { connected: true, readyState: mongoose.connection.readyState };
  } catch (err) {
    return {
      connected: false,
      readyState: mongoose.connection.readyState,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
