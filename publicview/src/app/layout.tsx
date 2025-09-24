import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/auth/AuthProvider";
import { Toaster } from "sonner";
import { SITE_CONFIG } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  keywords: "exhibition, stall booking, trade shows, business exhibitions, India",
  authors: [{ name: "Exhibition Management" }],
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
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
  verification: {
    google: "your-google-verification-code",
  },
};

// CRITICAL: Separate viewport export for mobile clarity and preventing blur
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
          <Toaster 
            richColors 
            position="top-right" 
            toastOptions={{
              style: {
                marginTop: '4.5rem', // Account for fixed header (h-16 = 4rem) + small gap
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
