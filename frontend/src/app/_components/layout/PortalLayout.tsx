import { Button } from '@/components/ui/button'
import React from 'react'

export default function PortalLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
        <nav className='p-4 flex justify-between'>
            <div>
                <h1 className='text-2xl font-bold'>Rise AI</h1>
            </div>
            <div>
                <Button>Join now</Button>
            </div>
        </nav>
        {children}
    </div>
  )
}
