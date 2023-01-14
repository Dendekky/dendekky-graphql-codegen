import type { NextApiRequest, NextApiResponse } from 'next';
import { codegen } from '@graphql-codegen/core';
import fs from 'fs';
import path from 'path';
import { buildSchema, printSchema, parse, GraphQLSchema } from 'graphql';
import * as typescriptPlugin from '@graphql-codegen/typescript';

const schema: GraphQLSchema = buildSchema(`type A { name: String }`);
const outputFile = 'filename.ts';
const config = {
  documents: [],
  config: {},
  // used by a plugin internally, although the 'typescript' plugin currently
  // returns the string output, rather than writing to a file
  filename: outputFile,
  schema: parse(printSchema(schema)),
  plugins: [
    // Each plugin should be an object
    {
      typescript: {}, // Here you can pass configuration to the plugin
    },
  ],
  pluginMap: {
    typescript: typescriptPlugin,
  },
};

const webCodegen = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const output = await codegen(config);
  //   await fs.writeFileSync(path.join(__dirname, outputFile), output, 'utf8');
//   console.log('Outputs generated!', output, 'done');
  const formattedStringOutput = output.replaceAll('\n', '');
  res
    .status(200)
    .json({ data: formattedStringOutput });
};

export default webCodegen;
