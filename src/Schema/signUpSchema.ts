import { z } from "zod";

export const usernameValidation=z
.string()
.min(2,"User must be atleast 2 characters")
.max(20,"User must be not more than 20 characters")
.regex(/^[a-zA-Z0-9_]+$/,"User must not contain special character")

export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid Email address"}),
    password:z.string().min(6,{message:"Password must be min 6 character"}),  
})