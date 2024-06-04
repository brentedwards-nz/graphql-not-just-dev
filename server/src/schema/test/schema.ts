const TestFields = `
  test_field: String!
`;

const test_types = `
  type Test {
    _id: ID
    ${TestFields}
  }

  input Args {
    param1: String
  }

  type ReturnData {
    data: String
  }
`;

const test_queries = `
  testEndpoint(data: Args): ReturnData
`;

const test_mutations = `
  testAddMemberToClub(club_id: ID!, member_id: ID!): Club
`;

export { test_types, test_queries, test_mutations };
