import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import SessionProvider from "@/components/providers/SessionProvider";
import SWRProvider from "@/components/providers/SWRProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pratham's Portfolio",
  description: "Connect, Collab and Chill",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black z-10 w-full min-h-screen`}
      >
        <SessionProvider>
          <SWRProvider>
            <div className="flex flex-col min-h-screen relative">
              {/* Fixed background decorative elements */}
              <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute w-[40rem] h-[40rem] bg-purple-500 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
                  <div className="absolute w-[40rem] h-[40rem] bg-blue-500 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" />
                </div>
              </div>
              
              {/* Main content container */}
              <Navbar />
              <main className="flex-1 relative z-10">
                {children}
              </main>
            </div>
          </SWRProvider>
        </SessionProvider>
      </body>
    </html>
  );
}