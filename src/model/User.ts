import mongoose, { Schema } from "mongoose";

export interface Message extends Document{
   content:string,
   createdAt:Date,
   _id:string
}
export interface User extends Document{
   username:string,
   email:string,
   password:string,
   verifyCode:string,
   verifyCodeExpiry:Date,
   isVerified:boolean,
   isAcceptingMessage:boolean,
   messages:Message[]
}

const MessageSchema:Schema<Message>=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    },
})

const UserSchema:Schema<User>=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'username is required'],
        trim:true,
        unique:true
    },
    email:{
         type:String,
         required:[true,"Email is required"],
         unique:true,
         match:[/.+\@.+\..+/,"please use a valid email address"]
    },
    password:{
        type:String,
        required:true
    },
    verifyCode:{
        type:String
    },
    verifyCodeExpiry:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})

const UserModel=(mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User",UserSchema);
export const MessageModel=(mongoose.models.Message as mongoose.Model<Message>)|| mongoose.model<Message>("Message",MessageSchema);
export default UserModel;
