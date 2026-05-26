import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { MobileHeader } from "@/components/layout/MobileHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VedaAI – Assessment Creator",
  description: "AI-powered question paper generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen w-screen overflow-hidden bg-[#EAEAEA] md:p-5 md:gap-5">
          <aside className="hidden md:flex shrink-0">
            <Sidebar />
          </aside>
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:bg-surface md:rounded-[24px] md:border md:border-border/80 md:shadow-sm">
            <MobileHeader />
            <main className="flex-1 overflow-y-auto pb-24 md:pb-0 flex flex-col min-h-0">
              {children}
            </main>
          </div>
        </div>
        <MobileTabBar />
      </body>
    </html>
  );
}
