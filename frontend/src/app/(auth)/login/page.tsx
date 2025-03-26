"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PortalLayout from "@/app/_components/layout/PortalLayout";
import { Button } from "@/components/ui/button";
import useAuthHook, { LoginType } from "../_lib/hooks";
import Link from "next/link";

export default function SignupFormDemo() {


  const [authState, setAuthState] = React.useState<LoginType>({
    password: "",
    identifier: ""
  });


  const {login} = useAuthHook();


  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthState({
      ...authState,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async () => {

    login({
      identifier: authState.identifier,
      password: authState.password
    })

  }


  return (
    <PortalLayout>
      <div className='flex items-center h-[90vh] justify-center'>
        <div className='min-w-[300px]'>
          <Card>
            <CardHeader>
              <CardTitle className='text-center'>Login</CardTitle>
            </CardHeader>
            <CardContent>
              <Input onChange={handleStateChange} type='text' placeholder='Username or email' name='identifier' className='border border-solid border-2' />
              <Input onChange={handleStateChange} type='password' placeholder='Password' name='password' className='border border-solid border-2' />
            </CardContent>
            <CardFooter>
            <div>
                <Button onClick={handleLogin} className='w-full'>Login</Button>
                <div className='text-sm mt-2'>Wanna join? <Link className='text-blue-700' href={"/signup"}>Sign up</Link></div>
              </div>
            </CardFooter>
          </Card>
        </div>

      </div>    
      </PortalLayout>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
