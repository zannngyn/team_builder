import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sow-teambuilder";

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseCache {
    conn: MongoClient | null;
    promise: Promise<MongoClient> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = MongoClient.connect(MONGODB_URI).then((client) => {
            return client;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}