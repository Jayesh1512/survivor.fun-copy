import type { Metadata, Viewport } from "next";
import { type ReactNode } from 'react';
import { Providers } from './providers';
import './globals.css';
import { Fredoka } from 'next/font/google'

const font = Fredoka(
{    subsets: ['latin'],
    weight: ['400','500','600','700']
  }
)

/**
 * Metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  return {
    title: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
        button: {
          title: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}`,
          action: {
            type: "launch_frame",
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE,
            splashBackgroundColor: "#FFFFFF",
          },
        },
      }),
    },
  };
}

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Providers>
          {props.children}
        </Providers>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  viewportFit: "cover"
};
