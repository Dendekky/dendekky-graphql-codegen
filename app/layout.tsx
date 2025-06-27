import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GraphQL Codegen Online - Generate TypeScript Types from GraphQL Schemas',
  description: 'Free online GraphQL code generator tool. Generate TypeScript types, React Query hooks, GraphQL Request SDK, and more from your GraphQL schemas instantly. No installation required.',
  metadataBase: new URL('https://graphqlcodegen.com'),
  keywords: [
    'GraphQL',
    'CodeGen',
    'TypeScript',
    'Code Generator',
    'GraphQL Types',
    'React Query',
    'GraphQL Schema',
    'Developer Tools',
    'GraphQL SDK',
    'Type Generation',
    'GraphQL Operations',
    'GraphQL Client',
    'Free Tools',
    'Online Generator'
  ],
  authors: [{ name: 'Ibrahim Adeniyi' }],
  creator: 'GraphQL Codegen Online',
  publisher: 'GraphQL Codegen Online',
  category: 'Developer Tools',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://graphqlcodegen.com',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'GraphQL Codegen Online - Generate TypeScript Types from GraphQL Schemas',
    description: 'Free online GraphQL code generator tool. Generate TypeScript types, React Query hooks, GraphQL Request SDK, and more from your GraphQL schemas instantly. No installation required.',
    url: 'https://graphqlcodegen.com',
    siteName: 'GraphQL Codegen Online',
    images: [
      {
        url: '/codegen.png',
        width: 1200,
        height: 630,
        alt: 'GraphQL Codegen Online - Free GraphQL Code Generator Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GraphQL Codegen Online - Generate TypeScript Types from GraphQL Schemas',
    description: 'Free online GraphQL code generator tool. Generate TypeScript types, React Query hooks, GraphQL Request SDK, and more from your GraphQL schemas instantly.',
    images: ['/codegen.png'],
    creator: '@dendekky',
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'GraphQL Codegen Online',
    description: 'Free online GraphQL code generator tool. Generate TypeScript types, React Query hooks, GraphQL Request SDK, and more from your GraphQL schemas instantly.',
    url: 'https://graphqlcodegen.com',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'GraphQL Codegen Online',
    },
    keywords: 'GraphQL, CodeGen, TypeScript, Code Generator, GraphQL Types, React Query, Developer Tools',
    inLanguage: 'English',
    isAccessibleForFree: true,
    browserRequirements: 'Requires JavaScript and a modern web browser',
    featureList: [
      'Generate TypeScript types from GraphQL schemas',
      'Support for React Query hooks',
      'GraphQL Request SDK generation',
      'Custom headers support',
      'Multiple output formats',
      'Dark/Light mode toggle',
      'Copy to clipboard functionality',
      'Download generated files'
    ],
  };

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
