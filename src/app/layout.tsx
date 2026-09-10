// src/app/layout.tsx
import type { Metadata } from "next";
import { AppProvider } from "@/src/shared/presentation/providers/app-provider";

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
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}