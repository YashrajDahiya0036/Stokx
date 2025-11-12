"use client";
import { Button } from "@/components/ui/button";
import { handleSendVerificationEmail } from "@/lib/actions/auth.action";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function VerifyEmailPage() {
	const searchParams = useSearchParams();
	const error = searchParams?.get("error");
	const userEmail = searchParams?.get("email");

	if(!userEmail) {
		return <div>No email provided for verification.</div>;
	}

	const handleSendVerification = async () => {
		console.log("Resending verification email to:", userEmail);
		const emailSent = await handleSendVerificationEmail(userEmail);
		if(emailSent.success) {
			toast.message("Verification email sent successfully!");
		} else {
			toast.message("Failed to send verification email.");
		}
	};

	if (error) {
		return <div className="text-center text-lg">The email could not be verified.</div>;
	}

	return (
		<>
		<h1 className="text-center text-xl">Email Verification Sent.Check Your Email</h1>
			<div className="flex justify-center mt-10" onClick={handleSendVerification}>
				<Button className="yellow-btn w-full max-w-[300px]">
					Send Verification Email Again
				</Button>
			</div>
			<div className="flex flex-col justify-center items-center mt-10 text-lg">
				You need to verify your email address before signing in.
				<Link href="/sign-in" className="hover:text-amber-400 hover:underline mt-5 text-center">
					Go to Sign In
				</Link>
			</div>
		</>
	);
}
