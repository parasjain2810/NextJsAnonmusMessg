'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import  * as z  from "zod"
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Form , FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/Schema/signInSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const page = () => {
 
  const [isSubmiting,setIsSubmiting]=useState(false);
  const { toast } = useToast()
  const router=useRouter()

  //zod implementation
  const form=useForm({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:'',
      password:''
    },
  })

  const onSubmit=async(data:z.infer<typeof signInSchema>)=>{
    setIsSubmiting(true)
    const result=await signIn('credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password,
    })
    if(result?.error){
      if(result.error=='CredentialsSignin'){
        toast({
          title:"Login Failed",
          description:"Username or password wrong",
          variant:'destructive'
        })
      }else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
      setIsSubmiting(false);
    }
    if(result?.url){
      toast({
        title:"Login Successfull",
        description:"User login successfully"
      })
      setIsSubmiting(false);
      router.replace('/dashboard');
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
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="Email/Username" {...field}/>
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
            isSubmiting?<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait</>:'SignIn'
          }
        </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <div>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page