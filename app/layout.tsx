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
  metadataBase: new URL("https://feeljapanwithk.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Feel Japan with K | Exclusive B2B Travel",
    description: "Curated luxury travel experiences for discerning agents.",
    url: "https://feeljapanwithk.com",
    siteName: "Feel Japan with K",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Feel Japan with K - Exclusive B2B Travel Showcase",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feel Japan with K | Exclusive B2B Travel",
    description: "Curated luxury travel experiences for discerning agents.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png?v=3",
    shortcut: "/favicon.png?v=3",
    apple: "/favicon.png?v=3",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="c8976d52-fda6-4b50-aef5-b476f39443ba"></script>
      </head>
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased bg-off-white text-midnight-navy font-sans`}
      >
        {children}

      </body>
    </html>
  );
}
