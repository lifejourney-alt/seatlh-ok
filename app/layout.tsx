import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css"; // Ensure you have this file (Tailwind directives)
import { Providers } from "./providers";

// 1. Load Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// 2. SEO Metadata
export const metadata: Metadata = {
  title: "Section-14 | The Experiment",
  description: "A double-blind algorithmic crush matching system for Nirma University.",
  icons: {
    icon: "/images/favicon.ico", // Add a heart icon to public/images later
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-rose-50/50 antialiased overflow-x-hidden`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 