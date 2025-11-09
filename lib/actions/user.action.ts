"use server";

import { connectToDatabase } from "@/database/mongoose";

export const getAllUsersForNewsEmail = async () => {
	try {
		const mongoose = await connectToDatabase();
		const db = mongoose.connection.db;

		if (!db) throw new Error("Database connection not established");

		const users = await db
			.collection("user")
			.find(
				{ email: { $exists: true, $ne: null } },
				{ projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } }
			)
			.toArray();

		return users
			.filter((user) => user.email && user.name)
			.map((user) => ({
				id: user.id || user._id.toString() || "",
				email: user.email,
				name: user.name,
			}));
	} catch (error) {
		console.error("Error fetching users", error);
		return [];
	}
};

export const addInWatchList = async (
	email: string,
	symbol: string,
	company: string
) => {
	try {
		const mongoose = await connectToDatabase();
		const db = mongoose.connection.db;

		if (!db) throw new Error("Database connection not established");

		const user = await db
			.collection("user")
			.findOne({ email }, { projection: { _id: 1 } });

		if (!user) {
			console.error("User not found with email:", email);
			return false;
		}

		const result = await db.collection("watchlists").insertOne({
			userId: user._id,
			email,
			symbol,
			company,
			addedAt: new Date(),
		});

		return result.acknowledged;
	} catch (error) {
		console.error("Error adding stock to watchlist", error);
		return false;
	}
};

export const removeFromWatchList = async (email: string, symbol: string) => {
	try {
		const mongoose = await connectToDatabase();
		const db = mongoose.connection.db;
		if (!db) throw new Error("Database connection not established");

		const result = await db
			.collection("watchlists")
			.deleteOne({ email, symbol });
		return result.deletedCount === 1;
	} catch (error) {
		console.error("Error removing stock from watchlist", error);
		return false;
	}
};

export const getUserWatchlist = async (email: string) => {
	try {
		const mongoose = await connectToDatabase();
		const db = mongoose.connection.db;
		if (!db) throw new Error("Database connection not established");

		const watchlist = await db
			.collection("watchlists")
			.find({ email })
			.toArray();

		return watchlist.map((item) => ({
			symbol: item.symbol,
		}));
	} catch (error) {
		console.error("Error fetching user watchlist", error);
		return [];
	}
};
