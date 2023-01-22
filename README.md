This is a [GraphQL Codegen](https://the-guild.dev/graphql/codegen) web wrapper. This project was borne out of the need to not add an extra codegen step to the development process. 
## Getting Started

You can find the deployed page on [Graphql Codegen Web](https://dendekky-graphql-codegen.vercel.app/).

To run locally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Guide

You can fetch types for graphql apis by visiting the webpage and adding the endpoint to the url as a query parameter like this:
https://dendekky-graphql-codegen.vercel.app/?graphqlApiEndpoint=https://swapi-graphql.netlify.app/.netlify/functions/index
As long as the the API is unauthenticated, the types will be generated and returned on the page

If you want to fetch the types for a graqhql api that is protected, just return to the home page https://dendekky-graphql-codegen.vercel.app. 
Here, you can input your authorization and the endpoint, then, generate the types. 
You can also fetch types for unauthenticated endpoints. Just leave the authorization field empty.

## API
The api is available on `api/codegen`. You can send the `graphqlApiEndpoint` as a query parameter or as the json body. For authenticated endpoints, pass the token with the `authorization` key in the request header


## TODO

- Improve the homepage design, and add guide
- Web adapter for other graphql codegens - this is strictly for typescript at this time.

