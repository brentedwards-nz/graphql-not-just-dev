# graphql-beginners-course
Graphql beginners course

https://www.udemy.com/course/graphql-beginners-course/

Role-based access control

Implementing role-based access control (RBAC) in GraphQL involves defining roles and permissions, then checking these permissions before executing GraphQL operations. Here's a general approach to implementing RBAC in GraphQL:

Define Roles and Permissions: Identify the roles that users can have in your system (e.g., admin, editor, viewer) and the permissions associated with each role (e.g., read, write, delete).

Extend Your GraphQL Schema: Add custom directives or fields to your GraphQL schema to represent permissions. For example, you could add a @auth directive to specific fields or types to indicate which roles are allowed to access them.

Implement Middleware or Resolvers: Write middleware or modify your resolver functions to check the permissions of the authenticated user before executing the requested operation. You can extract the user's role from the authentication token or session.

Handle Authorization Errors: If the user doesn't have the necessary permissions to execute a GraphQL operation, return an error indicating the authorization failure.

Here's a basic example in JavaScript using Apollo Server and GraphQL schema directives:

javascript
Copy code
const { ApolloServer, gql, SchemaDirectiveVisitor } = require('apollo-server');
const { defaultFieldResolver } = require('graphql');

// Define your GraphQL schema
const typeDefs = gql`
  type Query {
    sensitiveData: String @auth(requires: [ADMIN])
  }

  enum Role {
    ADMIN
    EDITOR
    VIEWER
  }

  directive @auth(requires: [Role]) on FIELD_DEFINITION
`;

// Define your resolvers
const resolvers = {
  Query: {
    sensitiveData: () => 'This is sensitive information!',
  },
};

// Implement the custom auth directive
class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { requires } = this.args;
    const originalResolve = field.resolve || defaultFieldResolver;

    field.resolve = function (parent, args, context, info) {
      const user = context.user; // Assume the user object contains role information

      // Check if the user has the required role
      if (!user || !requires.includes(user.role)) {
        throw new Error('You are not authorized to access this resource.');
      }

      return originalResolve.call(this, parent, args, context, info);
    };
  }
}

// Create the Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Extract the user from the request
    const user = req.headers.user; // Assume the user information is included in the headers
    return { user };
  },
  schemaDirectives: {
    auth: AuthDirective,
  },
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});
In this example:

We define a custom directive @auth that takes an array of required roles.
We implement a resolver middleware that checks if the authenticated user has the required role before executing the resolver function for the sensitiveData field.
We use Apollo Server to create the GraphQL server, passing the custom directive implementation in the schemaDirectives option.
We extract the user information from the request headers in the context function, assuming that the user's role is included in the headers.
You can adjust this example to fit your specific requirements and authentication mechanism.