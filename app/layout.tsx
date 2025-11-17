// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/providers/AuthProvider";
import { UserDataProvider } from "@/lib/providers/UserDataProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeQuest – Competitive Coding Tracker",
  description:
    "CodeQuest helps you track LeetCode, Codeforces, and CodeChef progress with custom tracks, team sheets, races, and revision mode.",
  metadataBase: new URL("https://codequest.dev"),
  applicationName: "CodeQuest",
  keywords: [
    "CodeQuest",
    "LeetCode",
    "Codeforces",
    "CodeChef",
    "competitive programming",
    "coding tracker",
    "DSA",
    "coding interview prep",
  ],
  authors: [{ name: "CodeQuest" }],
  openGraph: {
    title: "CodeQuest – Race Your Coding Progress",
    description:
      "Join teams, create custom problem tracks, compete in races, and level up your DSA skills across LeetCode, Codeforces, and CodeChef.",
    url: "https://codequest.dev",
    siteName: "CodeQuest",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "CodeQuest – Competitive Coding Tracker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeQuest – Competitive Coding Tracker",
    description:
      "Track your coding journey, create custom sheets, and race friends on LeetCode, Codeforces, and CodeChef.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" />
        <AuthProvider>
          <UserDataProvider>{children}</UserDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}