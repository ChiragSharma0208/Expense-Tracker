import mongoose,{Schema} from "mongoose";
import { UserFields } from "./user.model";

interface expenseDocument {
    userId: UserFields;
    title:string;
    amount:number;
    category:string;
    date:Date;
    description:string;
}


const expenseSchema:Schema<expenseDocument> =  new Schema({
   userId:{
    type: Schema.Types.ObjectId,
    ref: "User"
   },
   title:{
    type:String,
    required:true,
    unique:true,
    trim:true
   },
   amount:{
    type:Number,
    required:true,
   },
   category:{
    type:String,
    required:true,
    index:true,
   },
   date:{
    type:Date,
    required:true,
   },
   description:{
    type:String,
   }
   
},{timestamps:true});



export const Expense = mongoose.model<expenseDocument>("Expense",expenseSchema);