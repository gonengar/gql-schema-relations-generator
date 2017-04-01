# gql-schema-relations-generator
[![npm version](https://img.shields.io/npm/v/angular-cesium.svg?style=flat-square)](https://www.npmjs.com/package/gql-schema-relations-generator)

Analyze your graphql schema using this package in order to understand relations between your types.

## Getting started
+ install `gql-schema-relations-generator`:
  ```bash
  $ npm install --save gql-schema-relations-generator
  ```


## Example Usage
Without taking care of fields descriptions
# Schema file
```js
export default `
type Query {
  posts: [Post]
}

type Author {
  id: Int!
  firstName: String
  lastName: String
}

type Post {
  id: Int!
  title: String
  author: Author
  votes: Int
}

schema {
  query: Query
}
`;
```
# Main file
```js
import Schema from './src/example/data/schema';
import { Resolvers } from './src/example/data/resolvers';
import { makeExecutableSchema } from "graphql-tools";
import { SchemaRelationsGenerator } from 'gql-schema-relations-generator';

const schema = makeExecutableSchema({
	typeDefs: Schema,
	resolvers: Resolvers
});

let schemaRelations = new SchemaRelationsGenerator();

schemaRelations.generateRelationsMap(schema);

console.log(schemaRelations.getRelationsMap());
///The output will be: Map { 'Author' => Set { { rootName: 'Post' } } }
```

# Schema file(with descriptions)

(Please note that this time we've added a description to author field under type Post
```js
export default `
type Query {
  posts: [Post]
}

type Author {
  id: Int!
  firstName: String
  lastName: String
}

type Post {
  id: Int!
  title: String
  #authorId
  author: Author
  votes: Int
}

schema {
  query: Query
}
`;
```
# Main file
```js
import Schema from './src/example/data/schema';
import { Resolvers } from './src/example/data/resolvers';
import { makeExecutableSchema } from "graphql-tools";
import { SchemaRelationsGenerator } from 'gql-schema-relations-generator';

const schema = makeExecutableSchema({
	typeDefs: Schema,
	resolvers: Resolvers
});

let schemaRelations = new SchemaRelationsGenerator();

schemaRelations.generateRelationsMap(schema, true);//In case the second parameter is true - descriptions are taken care of

console.log(schemaRelations.getRelationsMap());
///The output will be: Map {'Author' => Set { { rootName: 'Post', description: 'authorId' } } }

```




