import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Signalist",
  description:
    "Track real-time stock prices, get personalized alerts and explore detailed company insights.",
  verification: {
    google: 'AEIYvh8rB3sPbsLFvPPLcowY0wBxWRwwYI07tc4vDFM',
  },
};

/**
 * Provides the application's root HTML layout and global styling.
 *
 * Renders an HTML document with language set to English and a dark theme, applies the Geist Sans and Geist Mono fonts plus antialiased styling to the body, and includes a global Toaster for notifications.
 *
 * @param children - The page or application content to be rendered inside the document body.
 * @returns The root HTML structure containing the body with applied font variables, the provided children, and the Toaster component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}