'use client';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/AppResponse";
  
type MessageCardProps={
    message:Message,
    onMessageDelete:(messgaeId:string)=>void

}
const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
  const {toast}=useToast();
    const handledeleteConfirm=async()=>{
        try {
          const response=await axios.delete(`/api/delete-message/${message._id}`)
        toast({
          title:response.data.message
        })
        } catch (error) {
          console.log('Error in changing toggle',error);     
          const axiosError=error as AxiosError<ApiResponse>;
          let errorMessage=axiosError.response?.data.message||"error to switching acceptance"
          toast({
            title:"Error",
            description:errorMessage,
            variant:"destructive"
          }) 
        }
        onMessageDelete(message._id);
    }
  return (
    <>
     <Card className="card-bordered">
  <CardHeader>
    <CardTitle>{message.content}</CardTitle>
  </CardHeader>
  <CardContent>
  <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className='w-5 h-5'/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handledeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </CardContent>
</Card>

    </>
  )
}

export default MessageCard