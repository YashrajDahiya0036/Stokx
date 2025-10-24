import {Inngest} from "inngest"

export const inngest = new Inngest({
	id: "Stokx Inngest Client",
	ai:{gemini:{apiKey: process.env.GEMINI_API_KEY}}
})