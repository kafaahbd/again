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
		icon: [
            { url: "/favicon.ico" }, // ডিফল্ট ফেভিকন
            { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
            { url: "/icon.png", sizes: "512x512", type: "image/png" },
        ],
		apple: [
            { url: "/apple-touch-icon.png" },
        ],
        other: [
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/apple-touch-icon.png',
            },
        ],
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
