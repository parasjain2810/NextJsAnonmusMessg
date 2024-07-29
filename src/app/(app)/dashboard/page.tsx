'use client'
import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Message, User } from "@/model/User"
import { acceptMessageSchema } from "@/Schema/acceptMessageSchema"
import { ApiResponse } from "@/types/AppResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const page = () => {
  const [messages,setMessages]=useState<Message[]>([])
  const [isloading,setIsLoading]=useState(false);
  const [isSwitching,setIsSwitching]=useState(false);
  const {toast}=useToast();

  const handleDeleteMessage=(messageId:string)=>{
      setMessages(messages.filter((message)=>message._id!==messageId))
  }//use react optimisation used in instagram likes etc.

  const {data:session}=useSession();
  const form=useForm({
    resolver:zodResolver(acceptMessageSchema)
  })
  const {register,watch,setValue}=form
  const acceptMessage=watch('acceptMessage')

  const  fetchAcceptanceMessage=useCallback(async()=>{
    setIsSwitching(true)
    try {
      const response=await axios.get(`/api/accept-messages`)
      setValue('acceptMessage',response.data.isAcceptingMessages)
      setIsSwitching(false);
    } catch (error) {
      console.log('Error in signup of user',error);     
      const axiosError=error as AxiosError<ApiResponse>;
      let errorMessage=axiosError.response?.data.message||"error to fetch message setting"
      toast({
        title:"Error",
        description:errorMessage,
        variant:"destructive"
      })
      setIsSwitching(false); 
    }
    
  },[setValue,toast])

  const fetchMessages=useCallback(async(refresh:boolean=false)=>{
   setIsLoading(true)
   setIsSwitching(true);
   try {
     const response=await axios.get(`/api/get-message`)
     setMessages(response.data.messages||[])
     if(refresh){
      toast({
        title:"Refressing...",
        description:'Latest Messages',
      }) 
     }
     setIsLoading(false)
   setIsSwitching(false);
   } catch (error) {
    console.log('Error in signup of user',error);     
      const axiosError=error as AxiosError<ApiResponse>;
      let errorMessage=axiosError.response?.data.message||"error to fetch message setting"
      toast({
        title:"Error",
        description:errorMessage,
        variant:"destructive"
      }) 
      setIsLoading(false)
      setIsSwitching(false);
   }
  },[setIsLoading,setMessages,toast])

  useEffect(()=>{
    if(!session||!session.user) return
    fetchAcceptanceMessage();
    fetchMessages();
  },[setValue,session,fetchAcceptanceMessage,fetchMessages,toast])

  const handleSwitchChange=async()=>{
    try {
      const response=await axios.post(`/api/accept-messages`,{acceptMessage:!acceptMessage})
      setValue('acceptMessage',!acceptMessage);
      toast({
        title:response.data.message,
        variant:'default'
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
  }
  
  if(!session||!session.user){
    return <div>Please Login First...</div>
  }

  const {username}=session?.user as User
  const baseUrl=`${window.location.protocol}//${window.location.host}`
  const profileUrl=`${baseUrl}/u/${username}`

  const copyToClipboard=()=>{
    navigator.clipboard.writeText(profileUrl);//for copy the url of the user
    toast({
      title:'Url copied',
      description:"Profile url has copied to clipboard"
    })
  }


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
      <div className="flex items-center">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-2 mr-2"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
    </div>

    <div className="mb-4">
      <Switch
        {...register('acceptMessage')}
        checked={acceptMessage}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitching}
      />
      <span className="ml-2">
        Accept Messages: {acceptMessage ? 'On' : 'Off'}
      </span>
    </div>
    <Separator />

    <Button
      className="mt-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        fetchMessages(true);
      }}
    >
      {isloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
    </Button>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageCard
            key={message._id}
            message={message}
            onMessageDelete={handleDeleteMessage}
          />
        ))
      ) : (
        <div>No messages to display.</div>
      )}
    </div>
  </div>
  )
}

export default page