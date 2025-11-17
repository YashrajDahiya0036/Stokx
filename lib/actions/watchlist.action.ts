"use server";

import { Watchlist } from "@/database/models/watchlist.model";
import { getAuth } from "../better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/database/mongoose";

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function addToWatchlist(symbol: string, company: string) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session?.user) redirect("/sign-in");

		const existingItem = await Watchlist.findOne({
			userId: session?.user.id,
			symbol: symbol.toUpperCase(),
		});

		if (existingItem) {
			return { success: false, message: "Symbol already in watchlist" };
		}

		const newItem = new Watchlist({
			userId: session?.user.id,
			symbol: symbol.toUpperCase(),
			company: company.trim(),
		});

		await newItem.save();
		return { success: true, message: "Symbol added to watchlist" };
	} catch (err) {
		console.error("Could not add symbol to watchlist: ", err);
		return { success: false, message: "Failed to add symbol to watchlist" };
	}
}

export async function removeFromWatchlist(symbol: string) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session?.user) redirect("/sign-in");

		await Watchlist.deleteOne({
			userId: session?.user.id,
			symbol: symbol.toUpperCase(),
		});
		revalidatePath("/watchlist");
		return { success: true, message: "Symbol removed from watchlist" };
	} catch (err) {
		console.error("Could not remove symbol from watchlist: ", err);
		return {
			success: false,
			message: "Failed to remove symbol from watchlist",
		};
	}
}

export async function getUserWatchlistSymbols(userId: string) {
	try {
		const items = await Watchlist.find({ userId }).select("symbol -_id");
		return items.map((item) => item.symbol);
	} catch (err) {
		console.error("Could not fetch watchlist symbols: ", err);
		return [];
	}
}

export async function getIsInWatchlist(userId: string, symbol: string) {
	try {
		const item = await Watchlist.findOne({
			userId,
			symbol: symbol.toUpperCase(),
		});
		return !!item;
	} catch (err) {
		console.error("Could not check watchlist status: ", err);
		return false;
	}
}
