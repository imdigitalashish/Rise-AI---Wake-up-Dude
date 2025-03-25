"use client";

import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight'
import React from 'react'

import {motion} from "motion/react";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LandingPageHeroComponent() {

    const router = useRouter();
    return (
        <div>
        <HeroHighlight>
            <motion.h1
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: [20, -5, 0],
                }}
                transition={{
                    duration: 0.5,
                    ease: [0.4, 0.0, 0.2, 1],
                }}
                className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
            >
                With RiseAI, You won't miss a single thing to do
               
                <Highlight className="text-black dark:text-white">
                    You get a super power of execution
                </Highlight>
            </motion.h1>
            <div className='w-fit m-auto mt-4 '>
                <Button onClick={() => {
                    router.push("/signup")
                }} className='cursor-pointer'>Let's go</Button>
                </div>

        </HeroHighlight>
        
        </div>
    )
}
