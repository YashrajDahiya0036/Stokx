"use server";

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "../inngest/clinet";
import { headers } from "next/headers";

export const signUpWithEmail = async ({
	email,
	password,
	fullName,
	country,
	investmentGoals,
	preferredIndustry,
	riskTolerance,
}: SignUpFormData) => {
	try {
		const response = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: fullName,
			},
		});
		if (response) {
			await inngest.send({
				name: "app/user.created",
				data: {
					email,
					name: fullName,
					country,
					investmentGoals,
					riskTolerance,
					preferredIndustry,
				},
			});
		}
		return { success: true, message: "Sign Up Successful" };
	} catch (error) {
		console.error("Sign Up Error:", error);
		return { success: false, message: "Sign Up Failed" };
	}
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
	try {
		await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		});
		return { success: true, message: "Sign In Successful" };
	} catch (error) {
		console.error("Sign In Error:", error);
		return { success: false, message: "Sign In Failed" };
	}
};

export const signOut = async () => {
	try {
		await auth.api.signOut({ headers: await headers() });
		return { success: true, message: "Sign Out Successful" };
	} catch (error) {
		console.error("Sign Out Error:", error);
		return { success: false, message: "Sign Out Failed" };
	}
};
