import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/app/components/ToastProvider";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Daylio – Stress Management",
  description: "Track your daily mood and manage stress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-[family-name:var(--font-nunito)] antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
