import type { Metadata } from "next";
import Providers from './providers';
import BuyMeCoffeeButton from '../components/BuyMeCoffeeButton';

export const metadata: Metadata = {
  title: "Projector Bach 24/7 TV - Live Streaming 24/7",
  description: "Watch Projector Bach live 24/7 on Twitch. Continuous live streaming, music, entertainment and more. Never stops, always live!",
  keywords: "24/7 streaming, live stream, Projector Bach, continuous streaming, 24/7 TV, live music, entertainment",
  openGraph: {
    title: "Projector Bach 24/7 TV - Live Streaming 24/7",
    description: "Watch Projector Bach live 24/7 on Twitch. Continuous live streaming, music, entertainment and more. Never stops, always live!",
    url: "https://projectorbach.vercel.app",
    siteName: "Projector Bach 24/7 TV",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Projector Bach 24/7 TV - Live Streaming",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projector Bach 24/7 TV - Live Streaming 24/7",
    description: "Watch Projector Bach live 24/7 on Twitch. Continuous live streaming, music, entertainment and more. Never stops, always live!",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <link href="https://fonts.googleapis.com/css2?family=Act+of+Rejection&display=swap" rel="stylesheet" />
        <link rel="canonical" href="https://projectorbach.vercel.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="author" content="Projector Bach" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:creator" content="@projectorbach" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body>
        <Providers>
          {children}
          <BuyMeCoffeeButton />
        </Providers>
      </body>
    </html>
  );
}
