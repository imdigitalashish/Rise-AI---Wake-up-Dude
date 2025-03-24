import PortalLayout from '@/app/_components/layout/PortalLayout'
import { Card, CardDescription, CardSkeletonContainer, CardTitle } from '@/components/cards-demo-3'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
function NewReactComponent() {
  return (
    <PortalLayout>
      <div className='flex items-center h-[90vh] justify-center border-b-0'>
        <p>Sign up</p>
      </div>

    </PortalLayout>
  )
}

export default NewReactComponent
