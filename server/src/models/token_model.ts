import mongoose, { Schema } from "mongoose";

export interface IToken {
  token_value: string;
  token_type: string;
}

const TokenSchema = new Schema<IToken>(
  {
    token_value: { type: String, required: true },
    token_type: { type: String, enum: ["token", "refresh"], required: true },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model<IToken>("Token", TokenSchema);
export default Token;
