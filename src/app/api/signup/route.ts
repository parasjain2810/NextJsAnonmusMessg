import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';


export const POST=async(req:Request)=>{
    await dbConnect();
    try {
        const {username,email,password}=await req.json();
        const existingVerifiedUserByUsername=await UserModel.findOne({username})
        if(existingVerifiedUserByUsername){
            return Response.json({
                success:false,
                message:"Username already exist"
            },{status:400})
        }
        const existingUserByemail=await UserModel.findOne({email})
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserByemail){
           if(existingUserByemail.isVerified){
            return Response.json(
                {
                  success: false,
                  message: 'User already exists with this email',
                },
                { status: 400 }
              );
           }
           else{
            const hashedPassword1= await bcrypt.hash(password,10)
            existingUserByemail.password=hashedPassword1
            existingUserByemail.verifyCode=verifyCode
            existingUserByemail.verifyCodeExpiry=new Date(Date.now()+3600000)
            existingUserByemail.save();
           }
        }
        else{
            const hashedPassword=await bcrypt.hash(password,10);
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser=await UserModel.create({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                isVerified:false,
                verifyCodeExpiry:expiryDate,
                messages:[]
            })
        }

        const emailResponse=await sendVerificationEmail(
            email,username,verifyCode
        )
        if(!emailResponse.success){
            return Response.json(
                {
                  success: false,
                  message: emailResponse.message,
                },
                { status: 500 }
              );
        }
        
        return Response.json(
            {
              success: true,
              message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
            );

            
    } catch (error) {
        console.error('Error registering user',error)
        return Response.json({
            success:false,
            messgae:'Error registering user'
        },{
              status:500
        })
    }
}