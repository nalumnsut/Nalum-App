// Web-only PWA shell — not rendered on native
// This file configures the HTML document for the Expo web build
// Platform guards are implicit — Expo Router only uses this on web

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />

        {/* App meta */}
        <meta name="application-name" content="Nalum" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nalum" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#fbf9f9" media="(prefers-color-scheme: light)" />

        {/* SEO */}
        <title>Nalum — Alumni Network</title>
        <meta
          name="description"
          content="Connect with your college alumni. Share updates, opportunities, and grow your professional network."
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Nalum — Alumni Network" />
        <meta
          property="og:description"
          content="Connect with your college alumni. Share updates, opportunities, and grow your professional network."
        />
        <meta property="og:site_name" content="Nalum" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/favicon.png" />

        {/*
          Google Fonts — loaded here for web.
          Native fonts are loaded via expo-font in _layout.tsx.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Google+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
