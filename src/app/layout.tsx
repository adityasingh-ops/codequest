import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeQuest – Competitive Coding Tracker",
  description:
    "CodeQuest helps you track LeetCode, Codeforces, and CodeChef progress with custom tracks, team sheets, races, and revision mode.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
