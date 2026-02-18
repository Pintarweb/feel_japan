import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feel Japan with K | Exclusive B2B Travel",
  description: "Curated luxury travel experiences for discerning agents.",
  icons: {
    icon: "/favicon.png?v=3",
    shortcut: "/favicon.png?v=3",
    apple: "/favicon.png?v=3",
  },
};

import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="c48cd15a-2535-414b-91ab-697f71ead818"></script>
      </head>
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased bg-off-white text-midnight-navy font-sans`}
      >
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
