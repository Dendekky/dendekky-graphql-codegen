import type { NextApiRequest, NextApiResponse } from 'next';
import { codegen } from '@graphql-codegen/core';
// import { generate } from '@graphql-codegen/cli'
import { printSchema, parse, GraphQLSchema } from 'graphql';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import { loadSchema } from '@graphql-tools/load';
import { UrlLoader } from '@graphql-tools/url-loader';

const generateConfig = (schema: GraphQLSchema) => ({
  documents: [],
  config: {},
  // used by a plugin internally, although the 'typescript' plugin currently
  // returns the string output, rather than writing to a file
  filename: '',
  schema: parse(printSchema(schema)),
  plugins: [
    {
      typescript: {},
    },
  ],
  pluginMap: {
    typescript: typescriptPlugin,
  },
});

const webCodegen = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  let schemaOptions: any = {
    loaders: [new UrlLoader()],
  };
  const { authorization } = req.body;
  const graphqlApiEndpoint =
    req.body.graphqlApiEndpoint || req.query.graphqlApiEndpoint;

  if (authorization) {
    schemaOptions = {
      ...schemaOptions,
      headers: { authorization },
    };
  }
  const schema = await loadSchema(graphqlApiEndpoint, schemaOptions);
  const config = generateConfig(schema);
  const output = await codegen(config);
  const formattedStringOutput = output.replaceAll('\n', '');
  return res.status(200).json({ data: formattedStringOutput });
};

export default webCodegen;
