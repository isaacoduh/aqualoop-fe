import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-aqualoop",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Aqualoop",
  description: "Water refill and reusable-bottle exchange marketplace"
};

export default function RootLayout({children}: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}