const { GraphQLServer } = require('graphql-yoga')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
// const Post = require('./resolvers/Post')
const User = require('./resolvers/User')
const db = require('./db');

const resolvers = {
    Query,
    Mutation,
    // Post,
    User,
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      db
    }
  },
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
