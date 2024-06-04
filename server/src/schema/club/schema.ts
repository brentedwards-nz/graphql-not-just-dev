const ClubFields = `
  name: String!
  phone_1: String
  phone_2: String
  email_1: String
  email_2: String
  address_1: String
  address_2: String
  address_3: String
  location_picture: String
  club_members: [ClubMember]
`;

const ClubMemberFields = `
  member: Member
  membership_status: String
  roles: String
`;

const club_types = `
  type Club {
    _id: ID
    ${ClubFields}
  }

  type ClubMember {
    _id: ID
    ${ClubMemberFields}
  }
`;

const club_queries = `
  clubs: [Club]
  club(id: ID!): Club
`;

const club_mutations = `
  createClub(
    name: String!
    phone_1: String
    phone_2: String
    email_1: String
    email_2: String
    address_1: String
    address_2: String
    address_3: String
    location_picture: String
  ): Club
  deleteClub(club_id: ID!): Int!
  addMemberToClub(club_id: ID!, member_id: ID!): Club
`;

export { club_types, club_queries, club_mutations };
