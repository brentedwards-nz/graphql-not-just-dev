import Member, { IMember } from  "../../models/member_model"
import Club from "../../models/club_model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs"

import { GraphQLError } from 'graphql';

type LoginResult = {
  member: IMember | null,
  token: string
}

type RegisterResult = {
  member: IMember,
  token: string
}
dotenv.config();
const JWT_ENCRYPTION_TOKEN = process.env.JWT_ENCRYPTION_TOKEN;
const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "1d";

export const mutations = {

  register: async (_: IMember, args: {
    email_1: string;
    password: string;
    first_name: string;
    second_name: string;
    preferred_name: string;
  }): Promise<RegisterResult> => {
    if(!JWT_ENCRYPTION_TOKEN) {
      throw new GraphQLError("No encryption token.", {
        extensions: {
          code: 'SERVER ERROR',
        },
      });
    }

    const existingMember: IMember | null = await Member.findOne({
      email_1: args.email_1
    });

    if(existingMember) {
      throw new GraphQLError("Email already taken.", {
        extensions: {
          code: 'SERVER ERROR',
        },
      });
    }
    
    const encryptedPassword = await bcrypt.hash(args.password, 10);

    console.log("***  Password:", args.password)
    console.log("*** Encrypted:", encryptedPassword)

    const member: IMember = await Member.create({
      email_1: args.email_1,
      hashed_password: encryptedPassword,
      first_name: args.first_name,
      second_name: args.second_name,
      preferred_name: args.preferred_name,
    });

    const user = {
      id: member.id
    }
    const accessToken: string = jwt.sign(
      user, 
      JWT_ENCRYPTION_TOKEN,  
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return {
      member: member,
      token: accessToken
    };
  },
  deleteMember: async (_: IMember, args: { id: string }): Promise<number> => {
    const post = await Member.deleteOne({ _id: args.id });
    return post.deletedCount;
  },
  addClubToMember: async (_: IMember, args: { member_id: string, club_id: string }): Promise<IMember | null> => {
    const clubResult = await Club.findByIdAndUpdate(
      args.club_id,
      { $push: { members: args.member_id } },
      { new: true, useFindAndModify: false }
    );

    if(!clubResult) {
      return null;  
    }
    
    const memberResult = await Member.findByIdAndUpdate(
      args.member_id,
      { $push: { clubs: args.club_id } },
      { new: true, useFindAndModify: false }
    );
    return memberResult;
  },
};

export const queries = {
  member: async (_: IMember, args: { id: string }): Promise<IMember | null> => {
    console.log("*** member", args.id)
    const member: IMember | null = await Member.findById(args.id).populate('clubs');
    return member;
  },
  members: async (): Promise<IMember[]> => {
    const members: Array<IMember> = await Member.find().populate('clubs');
    return members;
  },
  login: async (_: IMember, args: {
    email_1: string;
    password: string;
  }): Promise<LoginResult> => {
    if(!JWT_ENCRYPTION_TOKEN) {
      throw new GraphQLError("No encryption token.", {
        extensions: {
          code: 'SERVER ERROR',
        },
      });
    }

    const member: IMember | null = await Member.findOne({
      email_1: args.email_1
    });

    if(!member) {
      throw new GraphQLError("Invalid email.", {
        extensions: {
          code: 'SERVER ERROR',
        },
      });
    }

    if (!(await bcrypt.compare(args.password, member.hashed_password))) {
      throw new GraphQLError("Invalid password.", {
        extensions: {
          code: 'SERVER ERROR',
        },
      });
    }

    const user = {
      id: member.id
    }
    const accessToken: string = jwt.sign(
      user, 
      JWT_ENCRYPTION_TOKEN,  
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return {
      member: member,
      token: accessToken
    };
  },
};