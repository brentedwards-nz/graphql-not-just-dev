import mongoose, { Schema, HydratedDocument, Model } from "mongoose";
import { IMember } from "./member_model";

export interface IClub {
  name: string;
  phone_1: string;
  phone_2: string;
  email_1: string;
  email_2: string;
  address_1: string;
  address_2: string;
  address_3: string;
  location_picture: string;
  club_members: IClubMember[];
}

interface IClubMethods {
  fullAddress(): string;
}

interface IClubModel extends Model<IClub, {}, IClubMethods> {
  findAllMembers(): HydratedDocument<IClub, IClubMethods>;
}

const ClubSchema = new Schema<IClub, IClubModel>(
  {
    name: { type: String, required: true },
    phone_1: { type: String, required: false },
    phone_2: { type: String, required: false },
    email_1: { type: String, required: true, unique: true },
    email_2: { type: String, required: false, unique: false },
    address_1: { type: String, required: false, unique: false },
    address_2: { type: String, required: false, unique: false },
    address_3: { type: String, required: false, unique: false },
    location_picture: { type: String, required: false, unique: false },
    club_members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClubMember"
      },
    ]
  },
  {
    statics: {
      findAllMembers(cb) {
        return this.find();
      },
    },
    methods: {
      fullAddress(cb) {
        return this.address_1 + "\n" + this.address_2 + "\n" + this.address_3 + "\n";
      },
    },
    timestamps: true,
  }
);

const Club = mongoose.model<IClub, IClubModel>("Club", ClubSchema);
export default Club;

//-------------------------------------------------------------
// IClubMember
export interface IClubMember {
  member: IMember;
  membership_status: string;
  roles: string;
}

const ClubMemberSchema = new Schema<IClubMember>(
  {
    member: {type: mongoose.Schema.Types.ObjectId, ref: 'Member'},
    membership_status: { type: String, required: true },
    roles: { type: String, required: false },
  }
);

export const ClubMember = mongoose.model<IClubMember>("ClubMember", ClubMemberSchema);




