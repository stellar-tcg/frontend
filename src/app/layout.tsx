import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";
import { Nav } from "@/components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stellar TCG",
  description: "Blockchain-powered trading card game on Stellar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <WalletProvider>
          <AuthProvider>
            <Nav />
            <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
          </AuthProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
