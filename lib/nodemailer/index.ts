import nodemailer from "nodemailer";
import {
	NEWS_SUMMARY_EMAIL_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	WELCOME_EMAIL_TEMPLATE,
} from "./templates";

export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.NODEMAILER_EMAIL,
		pass: process.env.NODEMAILER_PASSWORD,
	},
});

export const sendWelcomeEmail = async ({
	email,
	name,
	intro,
}: WelcomeEmailData) => {
	const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace(
		"{{name}}",
		name
	).replace("{{intro}}", intro);

	const mailOptions = {
		from: `"Stokx News" <${process.env.NODEMAILER_EMAIL}>`,
		to: email,
		subject: "Welcome to Stokx! - Your stock market toolkit is ready.",
		text: "Thanks for joining Stokx! Now you have the tools to start your investment journey.",
		html: htmlTemplate,
	};

	await transporter.sendMail(mailOptions);
};

export const sendNewsSummaryEmail = async ({
	email,
	date,
	newsContent,
}: {
	email: string;
	date: string;
	newsContent: string;
}): Promise<void> => {
	const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace(
		"{{date}}",
		date
	).replace("{{newsContent}}", newsContent);

	const mailOptions = {
		from: `"Stokx News" <${process.env.NODEMAILER_EMAIL}>`,
		to: email,
		subject: `📈 Market News Summary Today - ${date}`,
		text: `Today's market news summary from Stokx`,
		html: htmlTemplate,
	};

	await transporter.sendMail(mailOptions);
};

export const sendUserVerificationEmail = async ({
	user,
	url,
}: {
	user: { id?: string; email?: string; name?: string };
	url: string;
}) => {
	const name = user.name || "User";
	const email = user.email || "";
	const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace(
		"{{name}}",
		name
	).replace(/{{url}}/g, url);// to replace all occurrences of {{url}}
	const mailOptions = {
		from: `"Stokx Support" <${process.env.NODEMAILER_EMAIL}>`,
		to: email,
		subject: "Please verify your email address",
		text: "Please verify your email address by clicking the link below:",
		html: htmlContent,
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error("Error sending verification email:", error);
	}
};
