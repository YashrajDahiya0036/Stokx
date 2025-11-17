import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Stokx",
	description:
		"Track real-time stock prices, get personlized alerts and explore detailed company insights",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
				<Toaster theme="dark" style={
        {
          "--normal-bg": "#141414",
          "--normal-text": "#e1e0e0",
          "--normal-border": "#e1e0e0",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }/>
			</body>
		</html>
	);
}
