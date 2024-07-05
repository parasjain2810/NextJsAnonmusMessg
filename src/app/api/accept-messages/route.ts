import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import { User } from "next-auth";


export const POST=async(request:Request)=>{
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

    const userId=user._id
    const {acceptMessage}=await request.json()
    try {
        const updatedUser=await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage:acceptMessage
        },{new:true})
        if(!updatedUser){
            return Response.json({
                success:false,
                message:"updation message is failed"
            },{
                status:401
            })
        }

        return Response.json({
            success:true,
            message:"Message acceptance update successfully"
        },{
            status:200
        })
    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message:"Failed To Accept Messages"
        },{
            status:500
        })
    }
}

export const GET=async(request:Request)=>{
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

    const userId=user._id
   try {
    const foundUser=await UserModel.findById(userId);
    if(!foundUser){
        return Response.json({
            success:false,
            message:"User doesn't found"
        },{
            status:401
        })
    }

    return Response.json({
        success:true,
        isAcceptingMessages:user.isAcceptingMessages
    },{
        status:200
    })
   } catch (error) {
     console.log(error)
     return Response.json({
          success:false,
          message:"Failed for messaging"
        },{
            status:500
        })
   }

}