import dbConnect from "@/lib/dbConnect";
import UserModel, { MessageModel } from "@/model/User";
import { getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";
export const DELETE=async(req:Request,{params}:{params:{messageId:string}})=>{
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
    try {

        const messageId=params.messageId;
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
          );
        const updateMessage=await MessageModel.findById(messageId);
        await updateMessage?.deleteOne();
      
          if (updateResult.modifiedCount===0) {
            return Response.json(
              { message: 'Message not found or already deleted', success: false },
              { status: 404 }
            );
          }

      return Response.json({
            success:true,
            message:'message deletion successfull'
        },{status:200})
        
    } catch (error) {
        return Response.json({
            success:false,
            message:'message deletion failed'
        })
    }
}