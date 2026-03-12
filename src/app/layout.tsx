import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";
import "katex/dist/katex.min.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

// app/layout.tsx
export const metadata = {
	title: "Study Corner",
	description: "Kafaah Study Corner",
	manifest: "https://study.kafaahbd.com/site.webmanifest", // এই লাইনটি গুরুত্বপূর্ণ
	themeColor: "#fff",
	icons: {
		apple: "https://study.kafaahbd.com/apple-touch-icon.png", // যদি থাকে
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ThemeProvider>
					<LanguageProvider>
						<AuthProvider>
							<ClientLayout>{children}</ClientLayout>
						</AuthProvider>
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
