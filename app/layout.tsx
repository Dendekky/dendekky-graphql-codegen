import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GraphQL Codegen Online',
  description: 'Generate TypeScript types from GraphQL schemas',
  metadataBase: new URL('https://graphql-codegen.vercel.app'),
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'GraphQL Codegen Online',
    description: 'Generate TypeScript types from GraphQL schemas',
    url: 'https://graphql-codegen.vercel.app',
    siteName: 'GraphQL Codegen Online',
    images: [
      {
        url: '/codegen.png',
        width: 1200,
        height: 630,
        alt: 'GraphQL Codegen Online',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GraphQL Codegen Online',
    description: 'Generate TypeScript types from GraphQL schemas',
    images: ['/codegen.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
