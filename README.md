# GraphQL Codegen Web Wrapper

This is a modern [GraphQL Codegen](https://the-guild.dev/graphql/codegen) web wrapper built with Next.js 15, featuring a stunning glassmorphism UI and comprehensive developer experience. This project eliminates the need for an extra codegen step in your development process.

## ✨ Features

### 🎨 **Modern UI/UX**
- **Stunning glassmorphism design** with animated gradient backgrounds
- **Responsive layout** that works beautifully on all devices
- **Dark/Light mode toggle** with system preference detection 🌙☀️
- **Animated blob backgrounds** with custom CSS animations
- **Hover effects** and smooth transitions throughout

### ⚡ **Developer Experience**
- **Next.js 15** with App Router for optimal performance
- **Server Actions** replacing traditional API routes
- **TypeScript** support with full type safety
- **Keyboard shortcuts** for power users ⌨️
  - `Ctrl+Enter`: Generate types
  - `Ctrl+D`: Download types
  - `Escape`: Cancel requests or clear
  - `Ctrl+Shift+T`: Toggle theme
  - `Ctrl+/`: Show shortcuts help

### 📊 **Performance & Metrics**
- **Real-time generation metrics** (time, file size, type count)
- **Request cancellation** with AbortController
- **Performance tracking** using high-precision timers
- **Smart file size formatting** (B/KB/MB)

### 🛠️ **Functionality**
- **Public GraphQL endpoints** (no authentication required)
- **Copy to clipboard** with visual feedback 📋
- **Download as .ts file** with proper TypeScript MIME type 📁
- **Error handling** with user-friendly messages
- **Loading states** with cancel functionality

## 🚀 Getting Started

You can find the deployed page on [GraphQL Codegen Web](https://dendekky-graphql-codegen.vercel.app/).

To run locally:

```bash
# Install dependencies
yarn install

# Run the development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📖 How to Use

### Web Interface

1. **Direct Input**: Visit the homepage and enter your GraphQL endpoint in the input field
2. **URL Parameter**: Pass the endpoint as a query parameter:
   ```
   https://dendekky-graphql-codegen.vercel.app/?graphqlApiEndpoint=https://your-api.com/graphql
   ```
3. **Keyboard Shortcuts**: Use `Ctrl+Enter` to generate, `Ctrl+D` to download, or `Ctrl+/` for help

### Example Endpoints

Try these public GraphQL APIs:

- **Star Wars API**: `https://swapi-graphql.netlify.app/.netlify/functions/index`
- **Countries API**: `https://countries.trevorblades.com/`
- **SpaceX API**: `https://spacex-production.up.railway.app/`

## 🏗️ Architecture

This project uses cutting-edge web technologies:

- **Next.js 15** with App Router for superior performance and developer experience
- **Server Actions** instead of API routes for type-safe server functions
- **Tailwind CSS** with **shadcn/ui** for beautiful, accessible components
- **TypeScript** for complete type safety throughout the application
- **next-themes** for seamless dark/light mode switching

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - Latest React with concurrent features
- [TypeScript 5.6](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - High-quality React components
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management
- [GraphQL Codegen](https://the-guild.dev/graphql/codegen) - Code generation

## 📝 Roadmap

### 🎯 **Next Priority Features**
- [ ] **Custom Headers Support** - Add non-auth headers (API keys, content-type, etc.)
- [ ] **Multiple Output Formats** - Support GraphQL operations, resolvers, hooks
- [ ] **Schema Introspection Visualization** - Interactive schema explorer
- [ ] **Schema Validation** - Real-time error highlighting and suggestions
- [ ] **Configuration Presets** - Save and reuse common configurations

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
- ✅ **Next.js 15 Migration** - App Router with server actions
- ✅ **shadcn/ui Integration** - Modern component library
- ✅ **TypeScript 5.6** - Latest TypeScript features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. The project is designed with extensibility in mind, making it easy to add new features.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

