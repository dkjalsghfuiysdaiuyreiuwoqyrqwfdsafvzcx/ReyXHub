import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import localFont from "next/font/local";
import "../../globals.css";
import Footer from "@/components/footer/Footer";
import HubNavbar from "@/components/navbar/HubNavbar";



export default function HubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="relative min-h-screen">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
            backgroundSize: "40px 40px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          }}
        />

        <HubNavbar />

        <main className="mx-auto w-full max-w-7xl px-4">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}