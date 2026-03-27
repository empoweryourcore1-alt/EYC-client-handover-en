import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle = "Pilates Studio Utrecht";
const siteDescription =
  "Empower Your Core® is een boutique Pilates studio in Utrecht, met personal training op maat om kracht, houding, mobiliteit en balans te verbeteren.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    siteName: siteTitle,
    images: [
      {
        url: "https://framerusercontent.com/assets/vHRkazprqjlKNPYIGqCjNq0SBnE.jpg",
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["https://framerusercontent.com/assets/vHRkazprqjlKNPYIGqCjNq0SBnE.jpg"],
  },
  icons: {
    icon: [
      {
        url: "https://framerusercontent.com/images/V0uNAAwsz2km4O7YXlokbIyotAM.png",
        rel: "icon",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "https://framerusercontent.com/images/k7E248CtnJHu28IJw0ujqxNzV24.png",
        rel: "icon",
        media: "(prefers-color-scheme: dark)",
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
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: '#0e0e0f' }}
      >
        {children}
      </body>
    </html>
  );
}
