import React from 'react'
import LandingPageHeroComponent from './_components/LandingPageHeroComponent'
import PortalLayout from '../_components/layout/PortalLayout'

export default function page() {
  return (
    <PortalLayout>
        <LandingPageHeroComponent />
    </PortalLayout>
  )
}
