import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../index.css";
import "katex/dist/katex.min.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { SocketProvider } from "../contexts/SocketContext";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

// Viewport settings for theme color and responsiveness
export const viewport: Viewport = {
	themeColor: "#0f172a",
	width: "device-width",
	initialScale: 1,
};

// Full SEO Metadata Configuration
export const metadata: Metadata = {
	title: "Kafa'ah Study Corner | SSC, HSC & Admission Preparation Bangladesh",
	description:
		"Kafa'ah Study Corner – বাংলাদেশের শিক্ষার্থীদের জন্য সেরা অনলাইন মডেল টেস্ট প্ল্যাটফর্ম। SSC, HSC, মেডিকেল ও ইঞ্জিনিয়ারিং এডমিশন প্রস্তুতির জন্য অধ্যায়ভিত্তিক পরীক্ষা, তাৎক্ষণিক ফলাফল ও ব্যাখ্যা।",
	keywords: [
		"Study Corner",
		"Kafa'ah Study Corner",
		"Kafa'ah Bangladesh",
		"SSC preparation",
		"HSC preparation",
		"medical admission",
		"engineering admission",
		"model test",
		"online exam",
	],
	authors: [{ name: "Kafa'ah Islamic and Multiproject Company" }],
	manifest: "https://study.kafaahbd.com/site.webmanifest",
	metadataBase: new URL("https://study.kafaahbd.com"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "Kafa'ah Study Corner | SSC, HSC & Admission Preparation Bangladesh",
		description:
			"SSC, HSC ও এডমিশন প্রস্তুতির জন্য ফ্রি অনলাইন মডেল টেস্ট প্ল্যাটফর্ম। Kafa'ah Bangladesh এর একটি উদ্যোগ ইনশাআল্লাহ।",
		url: "https://study.kafaahbd.com",
		siteName: "Kafa'ah Study Corner",
		images: [
			{
				url: "/stufy.jpg", // public ফোল্ডারে এই ইমেজটি আছে নিশ্চিত করুন
				width: 1200,
				height: 630,
				alt: "Kafa'ah Study Corner Preview",
			},
		],
		locale: "bn_BD",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Kafa'ah Study Corner | SSC, HSC & Admission Preparation Bangladesh",
		description:
			"অধ্যায়ভিত্তিক মডেল টেস্ট ও পরীক্ষার প্রস্তুতি। সম্পূর্ণ ফ্রি ইনশাআল্লাহ।",
		images: ["/stufy.jpg"],
		site: "@kafaahbd",
	},
	icons: {
		icon: [
			{ url: "https://study.kafaahbd.com/favicon.ico" }, // লিগ্যাসি ব্রাউজারের জন্য
			{ url: "https://study.kafaahbd.com/favicon.svg", type: "image/svg+xml" }, // আধুনিক ব্রাউজারের জন্য (ভেক্টর)
			{ url: "https://study.kafaahbd.com/favicon-16.png", sizes: "16x16", type: "image/png" },
			{ url: "https://study.kafaahbd.com/favicon-32.png", sizes: "32x32", type: "image/png" },
			{ url: "https://study.kafaahbd.com/favicon-48.png", sizes: "48x48", type: "image/png" },
			{ url: "https://study.kafaahbd.com/favicon-64.png", sizes: "64x64", type: "image/png" },
			{ url: "https://study.kafaahbd.com/favicon-96x96.png", sizes: "96x96", type: "image/png" },
			{ url: "https://study.kafaahbd.com/icon.png", sizes: "512x512", type: "image/png" },
		],
		apple: [{ url: "https://study.kafaahbd.com/apple-touch-icon.png", sizes: "180x180" }],
	},
	other: {
		"apple-mobile-web-app-title": "Study Corner",
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "black-translucent",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Structured Data (JSON-LD)
	const organizationJsonLd = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Kafa'ah Islamic and Multiproject Company",
		url: "https://study.kafaahbd.com/",
		logo: "https://study.kafaahbd.com/apple-touch-icon.png",
		image: "https://study.kafaahbd.com/stufy.jpg",
		sameAs: [
			"https://www.facebook.com/kafaahbd",
			"https://wa.me/8801837103985",
		],
		description:
			"প্রযুক্তির মাধ্যমে উম্মাহর সেবায়। ইসলামিক অ্যাপ, এডুকেশন প্ল্যাটফর্ম, এসএসসি/এইচএসসি/এডমিশন পরীক্ষার ব্যবস্থা।",
		contactPoint: {
			"@type": "ContactPoint",
			telephone: "+8801837103985",
			contactType: "customer support",
			areaServed: "BD",
			availableLanguage: ["bn", "en"],
		},
	};

	return (
		<html lang="bn">
			<head>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
				{/* JSON-LD Injection */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(organizationJsonLd),
					}}
				/>
			</head>
			<body className={inter.className}>
				<ThemeProvider>
					<LanguageProvider>
						<AuthProvider>
							<SocketProvider>
								<ClientLayout>{children}</ClientLayout>
							</SocketProvider>
						</AuthProvider>
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
