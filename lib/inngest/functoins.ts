import { getNews } from "../actions/finnhub.action";
import { getAllUsersForNewsEmail } from "../actions/user.action";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.action";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./clinet";
import {
	NEWS_SUMMARY_EMAIL_PROMPT,
	PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from "./prompts";
import { formatDateToday } from "../utils";

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
			const introText =
				(part && "text" in part ? part.text : null) ||
				"Thanks for joining Stokx! Now you have the tools to start your investment journey.";

			const {
				data: { email, name },
			} = event;

			return await sendWelcomeEmail({ email, name, intro: introText });
		});

		return {
			success: true,
			message: "Sign-up email process completed",
		};
	}
);

export const testGetAllUsersForNewsEmail = async () => {
	const users = await getAllUsersForNewsEmail();
	console.log("Users for news email:", users);
};
// testGetAllUsersForNewsEmail();


// cron:min hour day month day-of-week
export const sendDailyNewsSummary = inngest.createFunction(
	{ id: "daily-news-summary" },
	[{ event: "app/send.daily.news" }, { cron: "0 12 * * *" }],
	async ({ step }) => {
		// step 1 get all users for news dilevery
		const users = await step.run(
			"get-users-for-news",
			getAllUsersForNewsEmail
		);
		if (users.length === 0) {
			return {
				success: false,
				message: "No users found for news delivery",
			};
		}
		// step 2 get news for each user based on their preferences
        const results = await step.run('fetch-user-news', async () => {
            const perUser: Array<{ user: UserForNewsEmail; articles: MarketNewsArticle[] }> = [];
            for (const user of users as UserForNewsEmail[]) {
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles = await getNews(symbols);
                    // Enforce max 6 articles per user
                    articles = (articles || []).slice(0, 6);
                    // If still empty, fallback to general
                    if (!articles || articles.length === 0) {
                        articles = await getNews();
                        articles = (articles || []).slice(0, 6);
                    }
                    perUser.push({ user, articles });
                } catch (e) {
                    console.error('daily-news: error preparing user news', user.email, e);
                    perUser.push({ user, articles: [] });
                }
            }
            return perUser;
        });

		// step 3 summatrize the news using ai
		const userNewsSummaries: { user: User; newsContent: string | null }[] =
			[];
		for (const { user, articles } of results) {
			try {
				const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
					"{{newsData}}",
					JSON.stringify(articles, null, 2)
				);

				const response = await step.ai.infer(
					`summarize-news-${user.email}`,
					{
						model: step.ai.models.gemini({
							model: "gemini-2.5-flash-lite",
						}),
						body: {
							contents: [
								{
									role: "user",
									parts: [{ text: prompt }],
								},
							],
						},
					}
				);

				const part = response.candidates?.[0].content?.parts?.[0];
				const newsContent =
					part && "text" in part
						? part.text
						: null || "No market news";

				userNewsSummaries.push({ user, newsContent });
			} catch (error) {
				console.error("Error summarizing news for ", user.email, error);
				userNewsSummaries.push({ user, newsContent: null });
			}
		}
		// step 4 send the email to each user

		await step.run("send-news-emails", async () => {
			await Promise.all(
				userNewsSummaries.map(async ({ user, newsContent }) => {
					if (!newsContent) return;
					return await sendNewsSummaryEmail({
						email: user.email,
						date: formatDateToday,
						newsContent,
					});
				})
			);
		});
		return {
			success: true,
			message: "Daily news summary email sent",
		};
	}
);
