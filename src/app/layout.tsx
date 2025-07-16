import type { Metadata } from "next";
import Providers from './providers';

export const metadata: Metadata = {
  title: "Projector Bach TV",
  description: "24/7 Twitch streaming platform",
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
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
