# GraphQL Codegen Web Wrapper

This is a modern [GraphQL Codegen](https://the-guild.dev/graphql/codegen) web wrapper built with Next.js 15, Tailwind CSS, and shadcn/ui. This project eliminates the need for an extra codegen step in your development process.

## ✨ Features

- **Next.js 15** with App Router
- **Server Actions** for improved performance
- **Tailwind CSS** with **shadcn/ui** components
- **TypeScript** support
- **Public GraphQL endpoints** (no authentication required)
- **Clean, modern UI** with responsive design

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

### Example Endpoints

Try these public GraphQL APIs:

- **Countries API**: `https://countries.trevorblades.com/`
- **SpaceX API**: `https://spacex-production.up.railway.app/`
- **Star Wars API**: `https://swapi-graphql.netlify.app/.netlify/functions/index`

## 🏗️ Architecture

This project uses modern web technologies:

- **Next.js 15** with App Router for better performance and developer experience
- **Server Actions** instead of API routes for type-safe server functions
- **Tailwind CSS** with **shadcn/ui** for beautiful, accessible components
- **TypeScript** for type safety throughout the application

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [GraphQL Codegen](https://the-guild.dev/graphql/codegen)

## 📝 TODO

- [ ] Add dark mode toggle
- [ ] Support for custom headers (non-auth)
- [ ] Multiple output format support (GraphQL operations, resolvers, etc.)
- [ ] Schema introspection visualization
- [ ] Copy to clipboard functionality
- [ ] Download generated types as file

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

