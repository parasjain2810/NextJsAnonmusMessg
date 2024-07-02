import VerificationEmail from "../../emails/VerificationEmail";
import {resend} from '@/lib/resend';
import { ApiResponse } from "@/types/AppResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({username:username,otp:verifyCode}),
          });
        return {success:true,message:"Send email Successful"}
    } catch (emailError) {
        console.error("Error sending email",emailError)
        return {success:false,message:"Failed to send email"}
    }
}