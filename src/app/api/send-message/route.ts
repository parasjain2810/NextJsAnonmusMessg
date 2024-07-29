import dbConnect from "@/lib/dbConnect";
import { v4 as uuidv4 } from 'uuid';
import UserModel, { Message, MessageModel } from "@/model/User";


export const POST=async(req:Request)=>{
    await dbConnect();
    
    try {
        const {username,content}=await req.json();

        const user=await UserModel.findOne({username}).exec();
        if(!user){
            return Response.json({
                success:false,
                message:"user is not found"
            },{
                status:401
            })
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User Does not accept messages"
            },{
                status:402
            })
        }

        const newMessage=await MessageModel.create({content,createdAt:new Date()})
       
        const newMessageId=newMessage._id.toString()
        const latestMessage={content,createdAt:new Date(),_id:newMessageId}

        user.messages.push(latestMessage as Message);
        await user.save();

        return Response.json({
            success:true,
            message:"Message Send Successfully"
        },{
            status:200
        })

    } catch (error) {
        console.log(error,"error while sending message");
        return Response.json({
            success:false,
            message:"Error in sending Messgae"
        },{
            status:500
        })
    }
}