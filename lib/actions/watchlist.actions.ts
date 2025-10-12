"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export async function getWatchlistSymbolsByEmail(
  email: string
): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    // Better Auth stores users in the "user" collection
    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("getWatchlistSymbolsByEmail error:", err);
    return [];
  }
}

export async function addToWatchlist({
  symbol,
  company,
}: WatchlistButtonProps) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Not authenticated");

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({
        email: session?.user?.email,
      });

    if (!user) throw new Error("User not found");
    const userId = (user.id as string) || String(user._id || "");

    // Add to watchlist
    await Watchlist.create({ userId, symbol, company });

    return { success: true };
  } catch (err) {
    console.error("addToWatchlist error:", err);
    throw err;
  }
}

export async function removeFromWatchlist(symbol: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Not authenticated");

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({
        email: session?.user?.email,
      });

    if (!user) throw new Error("User not found");
    const userId = (user.id as string) || String(user._id || "");

    // Remove from watchlist
    await Watchlist.deleteOne({ userId, symbol });

    return { success: true };
  } catch (err) {
    console.error("removeFromWatchlist error:", err);
    throw err;
  }
}

export async function isInWatchlist(symbol: string): Promise<boolean> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return false;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({
        email: session?.user?.email,
      });

    if (!user) return false;
    const userId = (user.id as string) || String(user._id || "");

    const item = await Watchlist.findOne({ userId, symbol }).lean();
    return !!item;
  } catch (err) {
    console.error("isInWatchlist error:", err);
    return false;
  }
}
