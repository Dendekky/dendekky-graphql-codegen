# GraphQL Type Generator

This is a modern [GraphQL Type Generator](https://the-guild.dev/graphql/codegen) web wrapper built with Next.js 15, featuring a stunning glassmorphism UI and comprehensive developer experience. This project eliminates the need for an extra codegen step in your development process.

## ✨ Features

### 🎨 **Modern UI/UX**
- **Stunning glassmorphism design** with animated gradient backgrounds
- **Responsive layout** that works beautifully on all devices
- **Dark/Light mode toggle** with system preference detection 🌙☀️
- **Animated blob backgrounds** with custom CSS animations
- **Hover effects** and smooth transitions throughout
- **Clean, uncluttered interface** optimized for both simple and advanced users
- **Full-height output area** that expands to use all available space
- **Interactive copyable examples** with hover-to-reveal copy buttons

### 🔄 **Dual Input Modes**
- **GraphQL Endpoint Mode** - Connect to live GraphQL APIs with custom headers
- **Schema Definition Mode** - Paste GraphQL schema definitions directly
- **Seamless switching** between input modes with preserved state
- **Real-time schema validation** with error highlighting and helpful messages
- **Visual guidance** and format hints for schema definitions
- **Line count display** for schema definition input

### 🔍 **Schema Validation**
- **Real-time validation** with debounced input (300ms) for smooth typing
- **GraphQL spec compliance** using official GraphQL parser
- **Visual error highlighting** with dynamic border colors and status icons
- **Helpful error messages** with line/column information and suggestions
- **Validation state indicators** - loading, valid, error states with appropriate badges
- **Form integration** - prevents generation with invalid schemas
- **User-friendly error descriptions** with improvement suggestions for common mistakes

### ⚡ **Developer Experience**
- **Next.js 15** with App Router for optimal performance
- **Server Actions** replacing traditional API routes
- **TypeScript** support with full type safety
- **Advanced state management** with Zustand for optimal performance
- **Keyboard shortcuts** for power users ⌨️
  - `Ctrl+Enter`: Generate types
  - `Ctrl+D`: Download types
  - `Escape`: Cancel requests or clear
  - `Ctrl+Shift+T`: Toggle theme
  - `Ctrl+/`: Show shortcuts help
- **URL parameter support** for quick sharing and bookmarking

### 🚀 **Multiple Output Formats**
- **TypeScript Types** - Basic schema types (default)
- **TypeScript Operations** - Query/mutation types for operations
- **GraphQL Request SDK** - Ready-to-use SDK with fetch methods
- **Typed Document Node** - Pre-compiled DocumentNode for better performance
- **React Query Hooks** - TanStack Query hooks for React applications
- **TypeScript Resolvers** - Server-side resolver type signatures
- **Smart Dependencies** - Automatically includes required base plugins
- **Format Validation** - Ensures operations are provided when needed

### 📊 **Performance & Metrics**
- **Real-time generation metrics** (time, file size, type count)
- **Request cancellation** with AbortController
- **Performance tracking** using high-precision timers
- **Smart file size formatting** (B/KB/MB)
- **Visual format indicators** showing which formats were generated

### 🛠️ **Functionality**
- **Public & Private GraphQL endpoints** with custom header support 🔐
- **Direct schema definition input** for offline development 📝
- **Authentication headers** (Bearer tokens, API keys, custom headers)
- **GraphQL Operations Input** for client SDK generation
- **Copy to clipboard** with visual feedback 📋
- **Download as .ts file** with proper TypeScript MIME type 📁
- **Error handling** with user-friendly messages
- **Loading states** with cancel functionality
- **State persistence** - Form data persists across browser sessions

### 🔍 **SEO & Discoverability**
- **Comprehensive metadata** with targeted keywords and descriptions
- **Structured data (JSON-LD)** for enhanced search engine understanding
- **Open Graph & Twitter Cards** for social media sharing
- **Dynamic sitemap.xml** with proper priorities and change frequencies
- **robots.txt** with crawl guidelines and sitemap reference
- **Web app manifest** for PWA capabilities
- **About page** with detailed feature descriptions and technical information

## 🚀 Getting Started

You can find the deployed page on [GraphQL Type Generator](https://graphql-codegen.vercel.app/).

To run locally:

```bash
# Install dependencies
yarn install

# Run the development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📖 How to Use

### Online Interface

1. **Endpoint Mode**: 
   - Select "Endpoint URL" tab
   - Enter your GraphQL endpoint in the input field
   - Add custom headers if needed (for private APIs)
   - Click "Generate Types" or use `Ctrl+Enter`

2. **Schema Definition Mode**:
   - Select "Schema Definition" tab
   - Paste or type your GraphQL schema directly
   - **Real-time validation** provides instant feedback on schema correctness
   - Visual indicators show validation status (valid/error/validating)
   - Use the provided examples as templates
   - Click "Generate Types" or use `Ctrl+Enter` (disabled until schema is valid)

3. **Advanced Configuration**:
   - Click "Output Formats" to access advanced options
   - Select multiple output formats (TypeScript, React Query, etc.)
   - Add GraphQL operations for client SDK generation
   - Configure custom headers for authentication

4. **URL Parameter**: Pass the endpoint as a query parameter:
   ```
   https://graphql-codegen.vercel.app/?graphqlApiEndpoint=https://your-api.com/graphql
   ```

5. **Keyboard Shortcuts**: Use `Ctrl+Enter` to generate, `Ctrl+D` to download, or `Ctrl+/` for help

### Example Usage

#### **Schema Definition Example** (Click to copy)
```graphql
type Query {
  user: User
  posts: [Post!]!
}

type User {
  id: ID!
  name: String!
  email: String!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}
```

#### **Public APIs** (No headers required)
- **Star Wars API**: `https://swapi-graphql.netlify.app/.netlify/functions/index`
- **Countries API**: `https://countries.trevorblades.com/`
- **SpaceX API**: `https://spacex-production.up.railway.app/`

#### **APIs with Custom Headers** (Expand headers section)
- **GitHub GraphQL API**: `https://api.github.com/graphql`
  - Header: `Authorization: Bearer YOUR_GITHUB_TOKEN`
- **Shopify Admin API**: `https://YOUR_SHOP.myshopify.com/admin/api/2023-10/graphql.json`
  - Header: `X-Shopify-Access-Token: YOUR_ACCESS_TOKEN`
- **Hasura GraphQL**: `https://YOUR_HASURA_PROJECT.hasura.app/v1/graphql`
  - Header: `x-hasura-admin-secret: YOUR_ADMIN_SECRET`

## 🔒 Privacy & Security

- **Secure server-side processing** - All GraphQL introspection happens on our servers
- **No data storage** - We don't store your schemas, endpoints, or generated code
- **No tracking** - We don't track your usage or collect personal information
- **Open source** - Full transparency with publicly available code

## 🏗️ Architecture

This project uses cutting-edge web technologies:

- **Next.js 15** with App Router for superior performance and developer experience
- **Server Actions** instead of API routes for type-safe server functions
- **Tailwind CSS** with **shadcn/ui** for beautiful, accessible components
- **TypeScript** for complete type safety throughout the application
- **next-themes** for seamless dark/light mode switching
- **GraphQL Tools** for schema parsing, introspection, and validation

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - Latest React with concurrent features
- [TypeScript 5.6](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - High-quality React components
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management
- [GraphQL Codegen](https://the-guild.dev/graphql/codegen) - Code generation
- [GraphQL Tools](https://the-guild.dev/graphql/tools) - Schema utilities

## 🎯 **Latest Features** ⭐

### ✅ **Recently Completed**
- ✅ **Real-time Schema Validation** - Live validation with error highlighting and helpful messages
- ✅ **Schema Definition Input** - Direct schema paste/type functionality
- ✅ **Dual Input Modes** - Toggle between endpoint URL and schema definition
- ✅ **Comprehensive SEO** - Metadata, structured data, sitemap, robots.txt
- ✅ **Interactive Copy Examples** - Hover-to-reveal copy buttons on all examples
- ✅ **About Page** - Detailed information and feature descriptions
- ✅ **Enhanced Privacy Messaging** - Accurate server-side processing claims
- ✅ **Full-Height Output** - Textarea expands to use all available space
- ✅ **UI Polish** - Removed redundant format display, improved layout
- ✅ **Enhanced UX** - Better visual guidance and error handling

## 📝 Roadmap

### 🎯 **Next Priority Features**
- [ ] **Schema Introspection Visualization** - Interactive schema explorer
- [ ] **Configuration Presets** - Save and reuse common configurations
- [ ] **Auto-generation from URLs** - Automatically generate when URL contains endpoint
- [ ] **Schema Suggestions** - Auto-complete and intelligent schema suggestions

### 🔧 **Enhanced Developer Experience**
- [ ] **Schema Diff Comparison** - Compare schemas between versions
- [ ] **Batch Processing** - Handle multiple endpoints simultaneously
- [ ] **Advanced Caching** - Smart caching for repeated schema requests
- [ ] **Loading Skeletons** - Better loading states with skeleton UI
- [ ] **Export History** - Track and manage previous generations

### 🚀 **Advanced Features**
- [ ] **Plugin System** - Custom codegen plugin integration
- [ ] **Team Collaboration** - Share configurations and schemas
- [ ] **API Documentation** - Auto-generate docs from schema
- [ ] **Performance Analytics** - Track usage patterns and optimization

### ✅ **Completed Features**
- ✅ **Modern UI Redesign** - Glassmorphism with animated backgrounds
- ✅ **Dark/Light Mode** - Theme switching with system preference
- ✅ **Copy to Clipboard** - With visual feedback and success states
- ✅ **Download Functionality** - Save as TypeScript files
- ✅ **Keyboard Shortcuts** - Complete shortcut system with help modal
- ✅ **Performance Metrics** - Real-time generation tracking
- ✅ **Request Cancellation** - Abort long-running requests
- ✅ **Custom Headers Support** - Authentication headers, API keys, and custom headers
- ✅ **Next.js 15 Migration** - App Router with server actions
- ✅ **shadcn/ui Integration** - Modern component library
- ✅ **TypeScript 5.6** - Latest TypeScript features
- ✅ **Multiple Output Formats** - TypeScript, React Query, GraphQL Request, Resolvers, etc.
- ✅ **Advanced State Management** - Zustand for optimal performance and clean architecture
- ✅ **Modal-based UI** - Clean interface with progressive disclosure
- ✅ **GraphQL Operations Support** - Client SDK generation with operation inputs
- ✅ **Smart Format Dependencies** - Automatic plugin dependency resolution
- ✅ **State Persistence** - Form data persists across browser sessions
- ✅ **Schema Definition Input** - Direct schema paste functionality
- ✅ **Real-time Schema Validation** - Live validation with GraphQL spec compliance and helpful error messages
- ✅ **Dual Input Modes** - Endpoint URL and Schema Definition switching
- ✅ **SEO Optimization** - Complete SEO package with metadata, structured data, sitemap
- ✅ **Copyable Examples** - Interactive copy functionality for all code examples
- ✅ **Enhanced About Page** - Comprehensive tool information and features
- ✅ **Privacy & Security** - Accurate messaging about server-side processing
- ✅ **UI/UX Polish** - Full-height output, improved layout, better visual hierarchy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. The project is designed with extensibility in mind, making it easy to add new features.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

