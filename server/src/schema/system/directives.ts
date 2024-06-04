import { IMember, membership_status_type } from "../../models/member_model"
import { mapSchema, getDirectives, MapperKind } from "@graphql-tools/utils";
import {
  GraphQLSchema,
  GraphQLFieldConfig,
  defaultFieldResolver,
  GraphQLNamedType,
} from "graphql";

const getFieldConfigDirective = (
  schema: GraphQLSchema,
  fieldConfig: GraphQLFieldConfig<any, any, any>,
  directiveName: string
) => {
  return getDirectives(schema, fieldConfig)[directiveName];
};

// --- UPPER DIRECTIVE TRANSFORMER ---
export const upperDirectiveTransformer = (
  schema: GraphQLSchema,
  directiveName: string
) => {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const upperDirective = getFieldConfigDirective(
        schema,
        fieldConfig,
        directiveName
      );
      if (upperDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await resolve(source, args, context, info);
          console.log("RESOLVE...");

          if (typeof result === "string") {
            console.log("UPPER DIRECTIVE");
            return result.toUpperCase();
          }
          return result;
        };
        return fieldConfig;
      }
    },
  });
};

// --- AUTH DIRECTIVE TRANSFORMER ---
export const authDirectiveTransformer = (
  schema: GraphQLSchema,
  directiveName: string
) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const authDirective = getFieldConfigDirective(
        schema,
        fieldConfig,
        directiveName
      );
      if (authDirective) {
        const { requires } = authDirective;
        if (requires) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = function (source, args, context, info) {
            const user: IMember = context?.user

            if(!user) {
              throw new Error("Not authenticated");
            }

            console.log("*** requires", requires);
            return resolve(source, args, context, info);
          };
          return fieldConfig;
        }
      }
    },
  });
};

// --- AUTH DIRECTIVE TRANSFORMER ---
export const isActiveDirectiveTransformer = (
  schema: GraphQLSchema,
  directiveName: string
) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const authDirective = getFieldConfigDirective(
        schema,
        fieldConfig,
        directiveName
      );
      if (authDirective) {
        const { requires } = authDirective;
        if (requires) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = function (source, args, context, info) {
            const user: IMember = context?.user

            if(!user) {
              throw new Error("Not authorized");
            }

            if(user.membership_status != membership_status_type.Active) {
              throw new Error("Not authorized");
            }

            console.log("*** requires", requires);
            return resolve(source, args, context, info);
          };
          return fieldConfig;
        }
      }
    },
  });
};