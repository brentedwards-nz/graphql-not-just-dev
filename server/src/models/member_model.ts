import mongoose, { Schema, HydratedDocument, Model } from "mongoose";
import {IClub} from "./club_model";

export enum membership_status_type {
  New = "NEW",
  Pending = "PENDING",
  Active = "ACTIVE",
  Supended = "SUSPENDED",
  Cancelled = "CANCELLED",
}

export interface IMember {
  id: string;
  first_name: string;
  second_name: string;
  preferred_name: string;
  phone_1: string;
  phone_2: string;
  email_1: string;
  email_2: string;
  address_1: string;
  address_2: string;
  address_3: string;
  dob: Date;
  profile_picture: string;
  hashed_password: string;
  clubs: IClub[];
  membership_status: membership_status_type;
}

interface IMemberMethods {
  fullName(): string;
}

interface IMemberModel extends Model<IMember, {}, IMemberMethods> {
  findAllUsers(): HydratedDocument<IMember, IMemberMethods>;
}

const MemberSchema = new Schema<IMember, IMemberModel>(
  {
    first_name: { type: String, required: true },
    second_name: { type: String, required: true },
    preferred_name: { type: String, required: false },
    phone_1: { type: String, required: false },
    phone_2: { type: String, required: false },
    email_1: { type: String, required: true, unique: true },
    email_2: { type: String, required: false, unique: false },
    address_1: { type: String, required: false, unique: false },
    address_2: { type: String, required: false, unique: false },
    address_3: { type: String, required: false, unique: false },
    dob: { type: Date, required: false, unique: false },
    profile_picture: { type: String, required: false, unique: false },
    hashed_password: { type: String, required: true, unique: false },
    clubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club"
      }
    ],
    membership_status: {
      type: String,
      enum : membership_status_type,
      default: membership_status_type.New
    }
  },
  {
    statics: {
      findAllPosts(cb) {
        return this.find();
      },
    },
    methods: {
      fullName(cb) {
        return this.first_name + " " + this.second_name;
      },
    },
    timestamps: true,
  }
);

const Member = mongoose.model<IMember, IMemberModel>("Member", MemberSchema);
export default Member;
