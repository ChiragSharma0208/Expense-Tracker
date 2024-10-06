import createHttpError from "http-errors";
import { Income } from "../models/income.model";
import {Request,Response,NextFunction} from 'express';


const setIncome = async (req:Request,res:Response,next:NextFunction)=>{
    
    try {
        const {title,amount,category,date,description} = req.body;
        if(!title|| !amount|| !category|| !date){
            const err = createHttpError(400,"All fields are required");
            next(err);
        }
        const prevIncome = await Income.findOne({title});
        if(prevIncome){
            const err = createHttpError(400,"Income Already exsist");
            next(err);
        }
        const parsedDate = new Date(date);

        
        if (isNaN(parsedDate.getTime())) {
          return next(createHttpError(400, "Invalid date format"));
        }
        const income = await Income.create({
            title,
            amount,
            category,
            date:parsedDate,
            description,
            userId: req.user?._id
        })
        await income.save();
        
        const checkIncome = await Income.findById({_id:income._id});
        if(!checkIncome){
            const err = createHttpError(500,"Unable to create Income");
            next(err);
        }
        res.status(200).json({
            success:true,
            checkIncome,
            message:"Expense created successfully"
        })
        
    } catch (error) {
        if(error instanceof Error){
            console.log("Error occured while setting income",error.message);
            const err = createHttpError(500,error.message);
            next(err);
        }
    }

}

const getIncome = async (req:Request,res:Response,next:NextFunction)=>{
    
    try {
        const _id = req.user?._id;
        if(!_id){
            const err = createHttpError(400,"User not authenticated");
            return next(err);
        }
        const income = await Income.find({userId:_id}).select("-createdAt -updatedAt -userId -__v");
        if(!income){
            const err = createHttpError(500,"Income not found");
            return next(err);
        }
        res.status(200).json({success:true,income,message:"Income fetched successfully"});
        
    } catch (error) {
        if(error instanceof Error){
            console.log("Error occured while setting income");
            const err = createHttpError(500,error.message);
            next(err);
        }
    }
}


export {setIncome,getIncome}