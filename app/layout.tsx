import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ColorSrc | Color Format Converter",
  description: "ColorSrc - Convert between multiple color formats including HEX, HSL, OKLAB, OKLCH, and RGB. Open source color converter with auto-detection.",
  keywords: [
    "ColorSrc",
    "color converter",
    "OKLCH converter",
    "HSL converter",
    "color format",
    "web design",
    "CSS colors",
    "color transformation",
    "color space",
    "color palette",
    "design tools"
  ],
  authors: [{ name: "Yorukot" }],
  creator: "Yorukot",
  publisher: "Yorukot",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://colorsrc.yorukot.me/",
    title: "ColorSrc | Color Format Converter",
    description: "ColorSrc - Convert between multiple color formats including HEX, HSL, OKLAB, OKLCH, and RGB. Open source color converter with auto-detection.",
    siteName: "ColorSrc",
  },
  twitter: {
    card: "summary_large_image",
    title: "ColorSrc | Color Format Converter",
    description: "ColorSrc - Convert between multiple color formats including HEX, HSL, OKLAB, OKLCH, and RGB. Open source color converter with auto-detection.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://colorsrc.yorukot.me"),
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1E293B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-TDYPXH888V";
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E293B" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ModeToggle />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={gaId} />
    </html>
  );
}
