import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Member from "../../models/member_model";
import jwt, { Secret } from "jsonwebtoken";

const registerHandler = async (req: Request, res: Response) => {
  const ACCESS_TOKEN_EXPIRY: string = "30s";
  const REFRESH_TOKEN_EXPIRY: string = "1d";

  try {
    const { email, password, firstName, secondName } = req.body;

    console.log(req.body)

    const userExists = await Member.exists({ email_1: email.toLowerCase() });
    if (userExists) {
      return res.status(409).send("E-mail already in use.");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const member = await Member.create({
      first_name: firstName,
      second_name: secondName,
      email_1: email.toLowerCase(),
      hashed_password: encryptedPassword,
    });

    // create JWT token
    if (!process.env.JWT_ENCRYPTION_TOKEN) {
      return res.status(409).send("Could not generate token.");
    }
    const ACCESS_TOKEN_SECRET_KEY: Secret = process.env.JWT_ENCRYPTION_TOKEN;

    const token = jwt.sign(
      { userId: member._id, email },
      ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    if (!process.env.JWT_ENCRYPTION_REFRESH_TOKEN) {
      return res.status(409).send("Could not encrypt password.");
    }
    const REFRESH_TOKEN_SECRET_KEY: Secret = process.env.JWT_ENCRYPTION_REFRESH_TOKEN;

    const refreshToken = jwt.sign(
      { userId: member._id },
      REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none'
    });

    res.status(201).json({
      userDetails: {
        email: member.email_1,
        token: token,
        firstName: member.first_name,
        secondName: member.second_name,
      },
    });

  } catch (err) {
    console.log(`Error occured. Please try again: ${err}`)
    return res.status(500).send("Error occured. Please try again");
  }
};

const loginHandler = async (req: Request, res: Response) => {
  const ACCESS_TOKEN_EXPIRY: string = "30s";
  const REFRESH_TOKEN_EXPIRY: string = "1d";

  try {
    const { email, password } = req.body;

    const member = await Member.findOne({ 
      email_1: email.toLowerCase(),
    });

    if (!member) {
      return res.status(409).send("Invalid username or password.");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    if (!(await bcrypt.compare(password, member.hashed_password))) {
      console.log("Password incorrect");
      return res.status(400).send("Invalid credentials. Please try again");
    }

    // create JWT token
    if (!process.env.JWT_ENCRYPTION_TOKEN) {
      return res.status(409).send("Could not generate token.");
    }
    const ACCESS_TOKEN_SECRET_KEY: Secret = process.env.JWT_ENCRYPTION_TOKEN;

    const token = jwt.sign(
      { userId: member._id, email },
      ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    if (!process.env.JWT_ENCRYPTION_REFRESH_TOKEN) {
      return res.status(409).send("Could not encrypt password.");
    }
    const REFRESH_TOKEN_SECRET_KEY: Secret = process.env.JWT_ENCRYPTION_REFRESH_TOKEN;

    const refreshToken = jwt.sign(
      { userId: member._id },
      REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none'
    });

    res.status(201).json({
      userDetails: {
        email: member.email_1,
        token: token,
        firstName: member.first_name,
        secondName: member.second_name,
      },
    });

  } catch (err) {
    console.log(`Error occured. Please try again: ${err}`)
    return res.status(500).send("Error occured. Please try again");
  }
};

export {
  registerHandler,
  loginHandler
}
