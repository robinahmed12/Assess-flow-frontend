// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { AppProvider } from "@/src/shared/components/providers/app-provider";

import "./global.css";
import { cn } from "cn";

const jetbrainsMonoHeading = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Your App",
  description: "Your App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("font-sans", inter.variable, jetbrainsMonoHeading.variable)}
    >
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}