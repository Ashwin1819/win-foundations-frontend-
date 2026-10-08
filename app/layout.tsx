import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonateModal from "@/components/DonateModal";
import { DonateModalProvider } from "@/contexts/DonateModalContext";
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
  title: "Win Foundations - NGO",
  description: "Creating positive impact through education, health, and community empowerment",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DonateModalProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <DonateModal />
        </DonateModalProvider>
      </body>
    </html>
  );
}
