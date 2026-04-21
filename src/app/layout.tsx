import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simba Supermarket — Rwanda's Online Supermarket",
  description: "Shop fresh groceries, personal care, cleaning products and more. Delivered to your door in Kigali, Rwanda.",
  openGraph: {
    title: "Simba Supermarket",
    description: "Rwanda's #1 Online Supermarket",
  },
};

import BottomNav from "@/components/BottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased pb-16 lg:pb-0`}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
