import mongoose, { ConnectOptions } from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}

const dbConnect=async ():Promise<void>=>{
   if (connection.isConnected) {
     console.log("Database is already connected");
     return
   }
   
   try {
    const db=await mongoose.connect(process.env.MONGO_URL||'',{})
    connection.isConnected=db.connections[0].readyState
    console.log("Database is connected successfully")
} catch (error) {
       console.log("Database connection failed",error)
       process.exit(1);
   }
}

export default dbConnect;  