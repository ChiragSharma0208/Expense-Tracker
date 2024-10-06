import {Request,Response,NextFunction} from 'express';
import  jwt  from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.model';


declare global {
   namespace Express{
       interface Request{
           user?:User
       }
   }
}

interface jwtData{
    _id: string
}
 interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
}



export const verifyJwt = async(req:Request,res:Response,next:NextFunction)=>{
    try {
      const token = req.header("Authorization")?.replace("Bearer ","");
      if(!token){
         const error = createHttpError(401,"token is required");
         return next(error);
      }
      const check= jwt.verify(token,process.env.ACCESS_TOKEN||"") as jwtData;
      const user:User|null= await User.findById(check._id).select("-password");
      if(!user){
         const error = createHttpError(401,"User is not authenticated");
         return next(error);
      }
      req.user=user;
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      if (error instanceof jwt.JsonWebTokenError) {
      console.error("JWT Error Name:", error.name);
      console.error("JWT Error Message:", error.message);
      }
      const err = createHttpError(401,"Error occured while authenticating user with token");
      next(err);
    }
}