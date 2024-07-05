import { z } from "zod"; 
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/Schema/signUpSchema";


const UsernameQueryScehma= z.object({
    username:usernameValidation
})

export async function GET(request:Request){

 await dbConnect();
 try {
        const {searchParams}=new URL(request.url);//this is for getting the full url    
        const queryParams={
            username:searchParams.get('username')
        }//for getting query detail of username from url

        //check validation with zod
        const result=UsernameQueryScehma.safeParse(queryParams)
        
        if(!result.success){
            const usernameError=result.error.format().username?._errors||[]
            return Response.json({
                success:false,
                message:usernameError.length>0?usernameError.join(','):"Invalid query parameter",
            },{
                status:400
            })
        }
        const {username}=result.data;

       const existingVerifiedUser= await UserModel.findOne({username,isVerified:true})

       if(existingVerifiedUser){
        return Response.json({
              success:false,
              message:"Username is Already taken"
        },{status:400})  
       }

        return Response.json({
            success:true,
            message:"Username is unique"
        },{status:200})

 } catch (error) {
    console.error("Error in validation of username",error)
    return Response.json({
        success:false,
        message:'Error while checking username validation'
    },{
        status:500
    })
 }
}
