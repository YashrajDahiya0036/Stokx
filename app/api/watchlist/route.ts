// write a api to add and remove from watchlist in mongo db
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const { GET, POST, PUT } = auth.api;
getSession({ headers: await headers() });
if (!session?.user) redirect("/sign-in");
const session = await auth.api.getSession({ headers: await headers() });
if (!session?.user) redirect("/sign-in");
const user = {
	id: session.user.id,
	email: session.user.email,
	name: session.user.name,
};
