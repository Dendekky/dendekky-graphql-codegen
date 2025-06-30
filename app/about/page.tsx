import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, Zap, Shield, Users, Globe, Heart } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About - GraphQL Type Generator | Free GraphQL Code Generator',
  description: 'Learn about GraphQL Type Generator, the free tool for generating TypeScript types from GraphQL schemas. Discover our mission, features, and commitment to the developer community.',
  openGraph: {
    title: 'About - GraphQL Type Generator',
    description: 'Learn about GraphQL Type Generator, the free tool for generating TypeScript types from GraphQL schemas.',
    url: 'https://graphqlcodegen.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950'>
      <div className='relative container mx-auto p-6 max-w-4xl'>
        <div className='mb-12'>
          <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-white'>
            About GraphQL Type Generator
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300'>
            A free, open-source tool for the GraphQL developer community
          </p>
        </div>

        <div className='space-y-8'>
          <Card className='backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl'>
            <CardHeader>
              <CardTitle className='flex items-center gap-3 text-2xl'>
                <Heart className='h-6 w-6 text-red-500' />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className='prose prose-lg max-w-none dark:prose-invert'>
              <p>
                GraphQL Type Generator was created to simplify the GraphQL development experience. 
                We believe that generating TypeScript types from GraphQL schemas should be accessible, 
                fast, and free for every developer, regardless of their project size or budget.
              </p>
            </CardContent>
          </Card>

          <div className='grid md:grid-cols-2 gap-6'>
            <Card className='backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl'>
              <CardHeader>
                <CardTitle className='flex items-center gap-3'>
                  <Zap className='h-5 w-5 text-yellow-500' />
                  Performance First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 dark:text-gray-300'>
                  Built with Next.js 15 and modern web technologies for lightning-fast 
                  code generation and an exceptional user experience.
                </p>
              </CardContent>
            </Card>

            <Card className='backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl'>
              <CardHeader>
                <CardTitle className='flex items-center gap-3'>
                  <Shield className='h-5 w-5 text-green-500' />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 dark:text-gray-300'>
                  Secure server-side processing with no data retention. We never store your 
                  GraphQL schemas, headers, or generated code on our servers.
                </p>
              </CardContent>
            </Card>

            <Card className='backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl'>
              <CardHeader>
                <CardTitle className='flex items-center gap-3'>
                  <Users className='h-5 w-5 text-blue-500' />
                  Community Driven
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 dark:text-gray-300'>
                  Open source and community-focused. We welcome contributions 
                  and feedback to make the tool even better.
                </p>
              </CardContent>
            </Card>

            <Card className='backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl'>
              <CardHeader>
                <CardTitle className='flex items-center gap-3'>
                  <Globe className='h-5 w-5 text-purple-500' />
                  Always Free
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 dark:text-gray-300'>
                  No subscription fees, no usage limits, no hidden costs. 
                  Our tool will always be free for the developer community.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className='backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl'>
            <CardHeader>
              <CardTitle className='flex items-center gap-3 text-2xl'>
                <Code2 className='h-6 w-6 text-indigo-500' />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent className='prose prose-lg max-w-none dark:prose-invert'>
              <h3>Built With Modern Technologies</h3>
              <ul>
                <li><strong>Next.js 15:</strong> Latest React framework with App Router for optimal performance</li>
                <li><strong>TypeScript:</strong> Full type safety throughout the application</li>
                <li><strong>@graphql-codegen toolkit:</strong> Official GraphQL Code Generator tools including @graphql-codegen/cli, @graphql-codegen/core, @graphql-codegen/typescript, and various plugins for different output formats</li>
                <li><strong>GraphQL Tools:</strong> @graphql-tools/load and @graphql-tools/url-loader for schema introspection</li>
                <li><strong>Tailwind CSS & shadcn/ui:</strong> Beautiful, accessible, and responsive design</li>
                <li><strong>Zustand:</strong> Lightweight state management for optimal performance</li>
              </ul>
              
              <h3>Supported Output Formats</h3>
              <ul>
                <li>TypeScript Types - Basic schema types</li>
                <li>TypeScript Operations - Query/mutation types</li>
                <li>React Query Hooks - TanStack Query integration</li>
                <li>GraphQL Request SDK - Ready-to-use SDK</li>
                <li>Typed Document Nodes - Pre-compiled DocumentNodes</li>
                <li>TypeScript Resolvers - Server-side resolver types</li>
              </ul>
            </CardContent>
          </Card>

          <div className='text-center py-8'>
            <Link
              href='/'
              className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200'
            >
              <Code2 className='h-5 w-5' />
              Try GraphQL Type Generator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 