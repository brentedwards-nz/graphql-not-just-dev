//import { buildSchema } from "graphql";

import gql from "graphql-tag";
import { makeExecutableSchema, addResolversToSchema } from "@graphql-tools/schema";

import {member_types, member_queries, member_mutations} from "./member/schema";
import {queries as MemberQueries, mutations as MemberMutations} from "./member/resolvers";

import {club_types, club_queries, club_mutations} from "./club/schema";
import {queries as ClubQueries, mutations as ClubMutations} from "./club/resolvers";

import {test_types, test_queries, test_mutations} from "./test/schema";
import {queries as TestQueries, mutations as TestMutations} from "./test/resolvers";

import system_directives from "./system/schema";
import { upperDirectiveTransformer, authDirectiveTransformer, isActiveDirectiveTransformer } from "./system/directives";

const schema_definition = {
  typeDefs: gql`
    ${member_types}
    ${club_types}
    ${test_types}

    ${system_directives}

    type Query {
      ${member_queries}
      ${club_queries}
      ${test_queries}
    }

    type Mutation {
      ${member_mutations}
      ${club_mutations}
      ${test_mutations}
    }
  `,
  resolvers: {
    Query: {
      ...MemberQueries,
      ...ClubQueries,
      ...TestQueries,
    },
    Mutation: {
      ...MemberMutations,
      ...ClubMutations,
      ...TestMutations,
    },
  }
};

let schema = makeExecutableSchema(
  schema_definition,
);

schema = upperDirectiveTransformer(schema, 'upper');
schema = authDirectiveTransformer(schema, 'auth');
schema = isActiveDirectiveTransformer(schema, 'isActiveMember');

export default schema;