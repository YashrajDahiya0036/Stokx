import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";
import { sendUserVerificationEmail } from "../nodemailer";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
	if (authInstance) return authInstance;

	const mongoose = await connectToDatabase();
	const db = mongoose.connection.db;

	if (!db) throw new Error("MongoDB connection not found");

	authInstance = betterAuth({
		database: mongodbAdapter(db),
		secret: process.env.BETTER_AUTH_SECRET,
		baseURL: process.env.BETTER_AUTH_URL,
		emailAndPassword: {
			enabled: true,
			disableSignUp: false,
			requireEmailVerification: true,
			minPasswordLength: 8,
			maxPasswordLength: 128,
			autoSignIn: false,
		},
		emailVerification: {
			sendVerificationEmail: async ({ user, url }) => {
				await sendUserVerificationEmail({ user, url });
			},
			sendOnSignUp: true, // set true to send automatically when user signs up
			sendOnSignIn: false, // optionally resend on sign-in when unverified
			autoSignInAfterVerification: true, // optionally sign them in after they click the link
			expiresIn: 3600, // token TTL seconds
		},
		plugins: [nextCookies()],
	});

	return authInstance;
};

export const auth = await getAuth();
