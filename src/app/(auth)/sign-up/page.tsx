'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import  * as z  from "zod"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/Schema/signUpSchema";
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/AppResponse";
import { Form , FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
  const [username,setUsername]=useState('');
  const [usernameMessage,setUsernameMessage]=useState("");
  const [isCheckingUsername,setIsCheckingUsername]=useState(false);
  const [isSubmiting,setIsSubmiting]=useState(false);
  const debounce=useDebounceCallback(setUsername,500)
  const { toast } = useToast()
  const router=useRouter()

  //zod implementation
  const form=useForm({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    },
  })

  useEffect(()=>{
    const checkUsernameUnique=async()=>{
      if(username){
        setIsCheckingUsername(true);
      setUsernameMessage('');
      try {
        const res=await axios.get(`/api/check-username-unique?username=${username}`)
        setUsernameMessage(res.data.message);
        setIsCheckingUsername(false);
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>;
        setUsernameMessage(axiosError.response?.data.message||"Error while checking username")
        setIsCheckingUsername(false);
      }
      }
    }

    checkUsernameUnique();
  },[username])

  const onSubmit=async(data:z.infer<typeof signUpSchema>)=>{
    setIsSubmiting(true);
    try {
      const response=await axios.post<ApiResponse>('/api/signup',data)
      toast({
        title:'Success',
        description:response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmiting(false);
    } catch (error) {
      console.log('Error in signup of user',error);     
      const axiosError=error as AxiosError<ApiResponse>;
      let errorMessage=axiosError.response?.data.message
      toast({
        title:"Signup Fail",
        description:errorMessage,
        variant:"destructive"
      }) 
      setIsSubmiting(false);
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <div className="mb-4">Sign up to start your anonymous adventure</div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} onChange={(e)=>{
                    field.onChange(e);
                  debounce(e.target.value);
                }}/>
              </FormControl>
              {isCheckingUsername?<Loader2 className="animate-spin"/>:
              <div className={`text-sm ${usernameMessage==='Username is unique'?'text-green-400':'text-red-600'}`}>
               {usernameMessage}
              </div>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmiting}>
          {
            isSubmiting?
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait</>:'Signup'
          }
        </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <div>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page