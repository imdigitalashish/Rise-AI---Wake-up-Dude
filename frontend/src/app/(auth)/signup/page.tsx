"use client"

import PortalLayout from '@/app/_components/layout/PortalLayout'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useAuthHook, { UserRegister } from '../_lib/hooks'

function NewReactComponent() {



  const [authState, setAuthState] = React.useState<UserRegister>({
    username: "",
    password: "",
    email: ""
  });

  const {register} = useAuthHook();

  const handleRegister = () => {
    register(authState);
  }

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthState({
      ...authState,
      [e.target.name]: e.target.value
    })
  }


  return (
    <PortalLayout>
      <div className='flex items-center h-[90vh] justify-center'>
        <div className='min-w-[300px]'>
          <Card>
            <CardHeader>
              <CardTitle className='text-center'>Sign up</CardTitle>
            </CardHeader>
            <CardContent>
              <Input onChange={handleStateChange} type='email' placeholder='Email' name='email' className='border border-solid border-2' />
              <Input onChange={handleStateChange} type='text' placeholder='Username' name='username'  className='border border-solid border-2' />
              <Input onChange={handleStateChange} type='password' placeholder='Password' name='password'  className='border border-solid border-2' />
            </CardContent>
            <CardFooter>
             <Button onClick={handleRegister} className='w-full'>Join</Button>
            </CardFooter>
          </Card>
        </div>

      </div>

    </PortalLayout>
  )
}

export default NewReactComponent
