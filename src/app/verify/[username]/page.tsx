'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/Schema/verifySchema';
import { ApiResponse } from '@/types/AppResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const page = () => {
  
  const [isCheckingCode,setIsCheckingCode]=useState(false);
  const router=useRouter();
  const params=useParams();

  const {toast}=useToast();
   //zod implementation
   const form=useForm({
    resolver:zodResolver(verifySchema),
    defaultValues:{
      code:'',
      username:''
    }
  })

  const onSubmit=async(data:z.infer<typeof verifySchema>)=>{
      setIsCheckingCode(true);
    try {
      const response=await axios.post<ApiResponse>('/api/verify-code',{
        code:data.code,
        username:params.username
      })
      toast({
        title:'Success',
        description:response.data.message
      })
      setIsCheckingCode(false);
      router.replace(`/sign-in`)
    } catch (error) {
      console.log('Error in OTP checking',error);     
      const axiosError=error as AxiosError<ApiResponse>;
      let errorMessage=axiosError.response?.data.message
      toast({
        title:"OTP fail",
        description:errorMessage,
        variant:"destructive"
      }) 
      setIsCheckingCode(false);
    }

  }
  return (
   <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
          <h3 className="text-4xl font-extrabold tracking-tight lg:text-3xl mb-6">
            Check your email and enter the code
          </h3>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code :</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" >
        {
            isCheckingCode?
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait</>:'Submit'
          }
        </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page