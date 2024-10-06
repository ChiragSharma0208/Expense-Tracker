import mongoose,{Schema} from "mongoose";
import { UserFields } from "./user.model";

interface incomeDocument {
    userId: UserFields;
    title:string;
    amount:number;
    category:string;
    date:Date;
    description:string;
}


const incomeSchema:Schema<incomeDocument> =  new Schema({
   userId:{
    type: Schema.Types.ObjectId,
    ref: "User"
   },
   title:{
    type:String,
    required:true,
    trim:true,
    unique:true
   },
   amount:{
    type:Number,
    required:true,
   },
   category:{
    type:String,
    required:true,
    index:true
   },
   date:{
    type:Date,
    required:true,
   },
   description:{
    type:String,
   }
   
},{timestamps:true});



export const Income = mongoose.model<incomeDocument>("Income",incomeSchema);