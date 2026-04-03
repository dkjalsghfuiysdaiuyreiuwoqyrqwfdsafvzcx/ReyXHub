import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";



export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="min-h-screen overflow-x-hidden">
        <div className="relative min-h-screen">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: "white",
              backgroundImage: `
                linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
                radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
              `,
              backgroundSize: "80px 80px, 80px 80px, 100% 100%",
            }}
          />

          <Navbar />

          <main className="mx-auto w-full max-w-7xl px-4 h-full">
            {children}
          </main>
          <Footer />
        </div>
      </div>
  );
}