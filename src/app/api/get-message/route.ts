import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";


export const GET=async(req:Request)=>{
    await dbConnect();
    const session=await getServerSession(authOption);
    const user:User=session?.user;
    if(!session||!session.user){
        return Response.json({
            success:false,
            message:"Authentication Failed"
        },{
            status:400
        })
    }
    const userId=new mongoose.Types.ObjectId(user._id);
    try {
        const user=await UserModel.aggregate([
            { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();
       if(!user||user.length===0){
        return Response.json({
            success:false,
            message:"User doesn't found"
        },{
            status:400
        })
       }
       return Response.json({
        success:true,
        messages:user[0].messages
    },{
        status:200
    })
     
    } catch (error) {
        return Response.json({
            success:false,
            message:"get message is erroing"
        },{
            status:500
        })
    }
}