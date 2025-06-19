import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Nav from "@/ui/Nav";
import Footer from "@/ui/Footer";
import { LoginProvider } from "@/context/login-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "हरिपुर डिजिटल प्रोफाइल",
  description: "A websit for badimalika municipality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoginProvider>
          <Nav />
          {children}
          <Footer />
        </LoginProvider>
      </body>
    </html>
  );
}
