import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const POST=async(request:Request)=>{
    await dbConnect();
    try {
        const {username,code}=await request.json();
        const existingUser=await UserModel.findOne({username:username});
        if(!existingUser){
            return Response.json({
                success:false,
                message:"User doesn't found"
            },{status:400})
        }
         const isCodeverify=existingUser.verifyCode==code
         const isCodeExpire=new Date(existingUser.verifyCodeExpiry)> new Date()

         if(isCodeExpire&&isCodeverify){
            existingUser.isVerified=true,
            await existingUser.save()
         }else{
           if(!isCodeExpire){
            return Response.json({
                success:false,
                message:"Code is Expire"
            },{status:400})
           }else{
            return Response.json({
                success:false,
                message:"Wrong Code"
            },{status:400})
           }
         }

         return Response.json({
            success:true,
            message:"Successfully Signup"
        },{status:200})

    } catch (error) {
        console.error(error)
        return Response.json({
            success:false,
            message:"Code Validation Failed"
        },{status:500})       
    }
}