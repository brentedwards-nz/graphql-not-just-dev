const MemberFields = `
  first_name: String!
  second_name: String!
  preferred_name: String
  phone_1: String
  phone_2: String
  email_1: String
  email_2: String
  address_1: String
  address_2: String
  address_3: String
  profile_picture: String
  hashed_password: String!
  #dob: Date!
  clubs: [Club]
  membership_status: String!
`;

const member_types = `
  type Member {
    _id: ID
    ${MemberFields}
  }

  type RegisterResult {
    member: Member
    token: String
  }

  type LoginResult {
    member: Member
    token: String
  }
`;

const member_queries = `
  members: [Member] @auth
  member(id: ID!): Member @isActiveMember
  login(
    email_1: String!, 
    password: String!, 
  ): LoginResult
`;

const member_mutations = `
  register(
    email_1: String!, 
    password: String!, 
    first_name: String!, 
    second_name: String!, 
    preferred_name: String
  ): RegisterResult
  deleteMember(id: ID!): Int!
  addClubToMember(member_id: ID!, club_id: ID!): Int!
`;

export { member_types, member_queries, member_mutations };
