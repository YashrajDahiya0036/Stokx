import { inngest } from "@/lib/inngest/clinet"
import { sendDailyNewsSummary, sendSignUpEmail } from "@/lib/inngest/functoins"
import { serve } from "inngest/next"

export const {GET,POST,PUT} = serve({
	client:inngest,
	functions:[sendSignUpEmail,sendDailyNewsSummary]
})

