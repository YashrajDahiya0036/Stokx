import { sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./clinet";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";

export const sendSignUpEmail = inngest.createFunction(
	{ id: "sign-up-email" },
	{ event: "app/user.created" },
	async ({ event, step }) => {
		const userProfile = `
		- Country: ${event.data.country}
		- Investment Goals: ${event.data.investmentGoals}
		- Risk Tolerance: ${event.data.riskTolerance}
		- Preferred Industries: ${event.data.preferredIndustry}
		`;

		const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
			"{{userProfile}}",
			userProfile
		);

		const response = await step.ai.infer("generate-welcome-intro", {
			model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
			body: {
				contents: [
					{
						role: "user",
						parts: [{ text: prompt }],
					},
				],
			},
		});
		await step.run("send-welcome-email", async () => {
			const part = response.candidates?.[0].content?.parts?.[0];
			const introText = (part && "text" in part ? part.text : null) || "Thanks for joining Stokx! Now you have the tools to start your investment journey.";

			const {data:{email,name}} = event

			return await sendWelcomeEmail({email,name,intro:introText});
		}); 

		return {
			success: true,
			message: "Sign-up email process completed",
		};
	}
);
