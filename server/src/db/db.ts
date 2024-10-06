import mongoose from "mongoose";


const dbConnect = async ():Promise<void>=>{
    try {
         await mongoose.connect(process.env.MONGODB_URI||"");
        console.log("Db connected successfully ");
    } catch (error) {
        console.log("Error while connecting to database: ",error);
        process.exit(1);
    }
}


export default dbConnect;