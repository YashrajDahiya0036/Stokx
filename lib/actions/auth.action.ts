"use server";

import { getAuth } from "@/lib/better-auth/auth";
import { inngest } from "../inngest/clinet";
import { headers } from "next/headers";
import { APIError } from "better-auth";

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
		const auth = await getAuth();
		const response = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: fullName,
				callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`,
			},
		});
		try {
			if (response && typeof inngest?.send === "function") {
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
		} catch (ingErr) {
			console.error("Inngest send failed :", ingErr);
		}
		return { success: true, message: "Sign Up Successful" };
	} catch (error) {
		if (error instanceof APIError) {
			// console.error("Sign Up Error:", error);
			return { success: false, message: error.message };
		}
		throw error instanceof Error ? error : new Error("Sign Up Failed");
		// return { success: false, message: "Sign Up Failed" };
	}
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
	try {
		const auth = await getAuth();
		await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		});
		console.log("Sign In Response:");
		return { success: true, message: "Sign In Successful" };
	} catch (error) {
		if (error instanceof APIError) {
			console.log(error.message, error.status, error);
			return { success: false, message: error.message };
		}
		// console.error("Sign In Error:", error);
		// throw error instanceof Error ? error : new Error("Sign In Failed");
		return { success: false, message: "Sign In Failed", error };
	}
};

export const handleSendVerificationEmail = async (email:string) => {
	try {
		const auth = await getAuth();
		const data = await auth.api.sendVerificationEmail({
			body: {
				email,
				callbackURL: "/sign-in",
			},
		});
		console.log("Send Verification Email Response:", data);	
		return { success: true, message: "Send Verification Email Successful" };
	} catch (error) {
		return { success: false, message: "Send Verification Email Failed" };
	}
};
export const signOut = async () => {
	try {
		const auth = await getAuth();
		await auth.api.signOut({ headers: await headers() });
		return { success: true, message: "Sign Out Successful" };
	} catch (error) {
		console.error("Sign Out Error:", error);
		return { success: false, message: "Sign Out Failed" };
	}
};
