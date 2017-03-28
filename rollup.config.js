export default {
    entry: 'dist/index.js',
    dest: 'bundles/schema-relations-generator.umd.js',
    sourceMap: false,
    format: 'umd',
    moduleName: 'graphql.schema_relations_generator',
    globals: {
        'graphql': 'graphql'
    }
};
