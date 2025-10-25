"use client";

import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { signInWithEmail } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SignIn = () => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<SignInFormData>({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onBlur",
	});

	const router = useRouter(); 

	const onSubmit = async (data: SignInFormData) => {
		try {
			const result = await signInWithEmail(data);
			console.log("Sign In Result:", result);
			if (result.success) {
				toast.success("Sign In Successful!");
				router.push("/");
			}
		} catch (error) {
			console.error("Sign In Error:", error);
			toast.error("Sign In Failed.", {
				description:
					error instanceof Error
						? error.message
						: "Failed to createa an account",
			});
		}
	};
	return (
		<>
			<h1 className="form-title">Sign In</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				<InputField
					name="email"
					label="Email"
					type="email"
					placeholder="ramatra@example.com"
					register={register}
					error={errors.email}
					validation={{
						required: "Email is required",
						pattern: /^\S+@\S+$/i,
						message: "Email Addres is required",
					}}
				/>
				<InputField
					name="password"
					label="Password"
					placeholder="Enter a strong password"
					type="password"
					register={register}
					error={errors.password}
					validation={{
						required: "Password is required",
						minLength: 8,
					}}
				/>
				<Button
					type="submit"
					disabled={isSubmitting}
					className="yellow-btn w-full mt-5"
				>
					{isSubmitting
						? "Signing In..."
						: "Continue Your Investment Journey"}
				</Button>
				<FooterLink
					text="Don't have an account?"
					linkText="Create Account"
					href="/sign-up"
				/>
			</form>
		</>
	);
};

export default SignIn;
