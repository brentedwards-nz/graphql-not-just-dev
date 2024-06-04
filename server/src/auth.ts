import { Request, Response, NextFunction } from "express";
import Member, { IMember } from "./models/member_model";
import jwt, {TokenExpiredError, decode} from "jsonwebtoken";

interface IPAYLOAD {
  id: string;
}

export const getScope = async (authorizationHeader: string | null | undefined): Promise<IMember|null> => {
  if(!authorizationHeader) {
    return null;
  }
  const JWT_ENCRYPTION_TOKEN = process.env.JWT_ENCRYPTION_TOKEN;

  if(!JWT_ENCRYPTION_TOKEN) {
    console.log("JWT_ENCRYPTION_TOKEN was invalid: ", JWT_ENCRYPTION_TOKEN);
    return null;
  }

  const token = authorizationHeader.substring(7);  
  console.log(`TOKEN: ${token}`);
  let d: any;
  jwt.verify(
    token,
    JWT_ENCRYPTION_TOKEN,
    (err, decoded) => {
      if (err) {
        switch(err.name) {
          case "TokenExpiredError": {
            console.log('Could not verify jwt token: Token Expired')
            break;
          }
          
          default:
            console.log(`Could not verify jwt token:\n${err.name}\n${err.message}`)
        }
        
      }
      d = decoded;      
    }
  );

  if(d) {
    const m = await Member.findById(d.id);
    return m;
  }

  return null;
}

export const apiKeyMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if(process.env.BYPASS_API_KEY === "TRUE"){
    next();
    return;
  }

  console.log("*** apiKeyMiddleware: Checking api key");
  const x_api_key = req?.headers['x-api-key'];
  const expected_x_api_key = process.env.X_API_KEY;

  if(x_api_key != process.env.X_API_KEY){
    return res
    .status(401)
    .send({ status: 401, message: "Application not authenticated" });
  }
  next();
}

const authMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {

  if(process.env.BYPASS_AUTHORIZATION === "TRUE"){
    next();
    return;
  }



  const token_value = req.headers.authorization;
  console.log(token_value)

  if(!token_value) {
    return res
    .status(401)
    .send({ status: 401, message: "Request not authenticated" });
  }




  const member = await Member.findOne();
  if(!member) {
    return res
        .status(400)
        .send({ status: 400, message: "User not found" });
  }

  req.user = {...member, role: "ADMIN"};
  next();
};

export default authMiddleware;
