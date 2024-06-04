import { GraphQLResolveInfo } from 'graphql';
import Club, { IClub, IClubMember, ClubMember } from  "../../models/club_model"
import Member from "../../models/member_model";

export interface IReturnData {
  data: string;
}

export interface IArgs {
  param1: string;
}

export const mutations = {
  testAddMemberToClub: async (_: IClub, args: { club_id: string, member_id: string }): Promise<IClub | null> => {    
    // const foundClub = await Club.find({
    //   "_id": args.club_id,
    //   //"club_members": {"$elemMatch": { "member": args.member_id}}
    // })
    // .populate({
    //   path: 'club_members',
    //   populate: { path: "member",model: Member}
    // });
    console.log("*** testAddMemberToClub:");
    console.log("***   club_id:", args.club_id);
    console.log("*** member_id:", args.member_id);

    const foundClub = await Club.findById(args.club_id)
    .populate({
      path: "club_members",
      match: {member : { $eq: args.member_id}} 
    });

    if(!foundClub) {
      return null;
    }

    console.log("*** foundClub:", foundClub);

    return null;

    const memberResult = await Member.findByIdAndUpdate(
      args.member_id,
      { $push: { clubs: args.club_id } },
      { new: true, useFindAndModify: false }
    );

    if(!memberResult) {
      return null;  
    }

    const clubMember = await ClubMember.create(
      {
        member: args.member_id,
        membership_status: 'NEW',
        roles: ""
      }
    );

    const clubResult = await Club.findByIdAndUpdate(
      args.club_id,
      { $push: { club_members: [
          clubMember._id
      ] } },
      { new: true, useFindAndModify: false }
    )
    .populate({
      path: 'club_members',
      populate: { 
        path: "member",
        model: Member
      }
    });

    return clubResult;
  }, 
};

export const queries = {
  testEndpoint: (parent: any, args: { data: IArgs }, contextValue: any, info: GraphQLResolveInfo): IReturnData => {
    console.log("**** dummy:");
    console.log("**** args:", args);
    console.log("**** contextValue:", contextValue);
    console.log("");

    console.log("data:", args.data);
    const returnData: IReturnData = {
      data: args.data.param1
    };
    return returnData;
  },
};