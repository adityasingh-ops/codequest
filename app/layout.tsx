// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/providers/AuthProvider";
import { UserDataProvider } from "@/lib/providers/UserDataProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeetCode Tracker",
  description: "Track your LeetCode progress",
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
          <UserDataProvider>
            {children}
          </UserDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}