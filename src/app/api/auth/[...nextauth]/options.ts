import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

export const authOption:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"},
            },
            async authorize(credentials:any):Promise<any> {
                await dbConnect();
                try {
                   const user= await UserModel.findOne({
                            $or:[
                                {email:credentials.identifier},
                                {username:credentials.identifier}
                            ],
                    })
                    if(!user){
                        throw new Error('no user find with this email')
                    }
                    if(!user.isVerified){
                        throw new Error('Please verify your account first')
                    }

                    const checkPass=await bcrypt.compare(credentials.password,user.password) ;
                    if(!checkPass) throw new Error('Incorrect Password');
                    else return user;
                    
                } catch (error:any) {
                    throw new Error(error)
                }
            },
        })
    ],
    callbacks:{
        async jwt({token,user}) {
            if(user){
                token._id=user._id?.toString(),
                token.isVerified=user.isVerified,
                token.isAcceptingMessages=user.isAcceptingMessages
                token.username=user.username
            }
            return token;
        },
        async session({session,token}){
           if(token){
            session.user._id=token._id
            session.user.isVerified=token.isVerified
            session.user.isAcceptingMessages=token.isAcceptingMessages
            session.user.username=token.username

           }
            return session;
        }
    },
    session:{
        strategy:"jwt"
    },
    pages:{
       signIn:'/sign-in'
    },
    secret:process.env.NEXTAUTH_SECRET,
    
}