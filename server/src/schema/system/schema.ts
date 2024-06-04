import { defaultFieldResolver } from "graphql";
import { SchemaDirectiveVisitor, VisitableSchemaType } from "@graphql-tools/utils";
import {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLField,
  GraphQLSchema,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLArgument,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLEnumValue,
  GraphQLInputObjectType,
  GraphQLInputField,
} from "graphql";

import { AuthenticationError } from "apollo-server-express";

const system_directives = `
  directive @upper on FIELD_DEFINITION

  directive @isAuth on FIELD_DEFINITION

  directive @auth(requires: [Role] = [ADMIN]) on OBJECT | QUERY | FIELD_DEFINITION
  enum Role {
    ADMIN
    MEMBER
  }

  directive @isActiveMember (requires: [MembershipStatus] = [ACTIVE]) on  QUERY | FIELD_DEFINITION
  enum MembershipStatus {
    NEW
    PENDING
    ACTIVE
    SUSPENDED
    CANCELLED
  }
`;

export default system_directives;
