"use client"

import { Button } from '@/components/ui/button'
import React, { useEffect } from 'react'

export default function PortalLayout({ children }: { children: React.ReactNode }) {


  const [userLoggedIn, setUserLoggedIn] = React.useState(false)



  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setUserLoggedIn(true)
    }
  }, [])

  return (
    <div>
      <nav className='p-4 flex justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Rise AI</h1>
        </div>
        <div>
          {userLoggedIn ? <Button variant={"destructive"}>Logout</Button> : <Button>Join now</Button>}
        </div>
      </nav>
      {children}
    </div>
  )
}
