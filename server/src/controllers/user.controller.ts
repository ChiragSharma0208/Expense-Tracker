import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import createHttpError from "http-errors";
import uploadToCloudinary from "../utils/cloudinary";

const userRegisteration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  const exsistingUser = await User.findOne({email});
  if(exsistingUser){
    const error = createHttpError(400,"User already exsist");
    next(error);
  }
  const avatar = req.file?.path;

  try {
    let avatarUrl = "";

    if (avatar) {
      const cloudinaryResult = await uploadToCloudinary(avatar);
      avatarUrl = cloudinaryResult?.secure_url || "";
    }
    const userDoc = new User({
      firstName,
      lastName,
      email,
      password,
      avatar: avatarUrl,
    });

    await userDoc.save();
    const token = userDoc.generateAccessToken();

    res.status(201).json({  token });
  } catch (error) {
    if (error instanceof Error) {
      if ((error as any).code === 11000) {
        const err = createHttpError(400, "Email already exists");
        return next(err);
      }
      console.log(error.message);
      res.status(400).json({ message: error.message });
    } else {
      console.log("Unknown error occurred:", error);
      res.status(400).json({ message: "An unknown error occurred." });
    }
  }
};

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email) {
    const error = createHttpError(400, "Email is required");
    return next(error);
  }
  if ( !password) {
    const error = createHttpError(400, "Email and password are required");
    return next(error);
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = createHttpError(404, "User does'nt exsist");
      return next(error);
    }

    const isPasswordValid = await user.checkPassword(password);

    if (!isPasswordValid) {
      const error = createHttpError(401, "Invalid password");
      return next(error);
    }

    const token = user.generateAccessToken();
    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
    });
  } catch (error) {
    console.log("Error occured while logging in");
    return next(error);
  }
};


const getUserById = async (req:Request,res:Response,next:NextFunction)=>{
   try {
    const user = req.user;
    if(!user){
     const error = createHttpError(400,"Unable to fetch User");
     return next(error);
    }
    res.status(200).json({success:true,user,message:"User fetched successfully"});

   } catch (error) {
    if(error instanceof Error){
      const err = createHttpError(500,error.message);
      return next(err);
    }
    const err = createHttpError(500,"Unable to find user");
    return next(err);
   }
}


export { userRegisteration, userLogin,getUserById };
