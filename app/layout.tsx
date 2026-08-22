import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { stripMarkup } from "@/components/RichText";
import Shell from "@/components/Shell";
import { profile } from "@/content/profile";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: profile.name,
  description: stripMarkup(profile.bio[0]),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
