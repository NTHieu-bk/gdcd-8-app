import type { Metadata } from "next";
import { Inter, Alumni_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "../components/ui/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const alumniSans = Alumni_Sans({
  variable: "--font-alumni-sans",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Giáo Dục Công Dân - Công Dân Toàn Cầu",
  description: "Khám phá – Hiểu biết – Tôn trọng – Cùng phát triển",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi" suppressHydrationWarning
      className={`${inter.variable} ${alumniSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-lacquer-black text-text-warm">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

