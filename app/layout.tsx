import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ClipCompress",
  description:
    "ClipCompress - A Video Compression WebApp Which Uses AI to Compress Your Videos Without Losing Quality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/ClipCompressLogo.jpg" />
          <link rel="apple-touch-icon" sizes="180x180" href="/ClipCompressLogo.jpg" />
          <link rel="icon" type="image/jpg" sizes="32x32" href="/ClipCompressLogo.jpg" />
          <link rel="icon" type="image/jpg" sizes="16x16" href="/ClipCompressLogo.jpg" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
