import React from 'react'
import { motion , useScroll} from "framer-motion";
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import { Card, CardContent } from "@/components/ui/card"
const HeroCarousel = () => {
  return (
    <div>
      <Carousel  plugins={[
        Autoplay({
          delay: 7000,
        }),
      ]} className="w-full max-w-screen">
      <CarouselContent className="--1">
       <CarouselItem>
       <div className='bg-gradient-to-t	from-cyan-500 to-blue-500 h-screen'>
      
      <motion.h1 initial={{x:200, opacity: 0, scale: 0.5 }}
     animate={{ opacity: 1, scale: 1, x:0 }}
     transition={{ duration: 1 }} className='text-5xl mb-10 pt-[40vh] text-center font-bold'>Welcome to Campus Chronicles</motion.h1>
     <motion.h1 initial={{x:-200, opacity: 0, scale: 0.5 }}
     animate={{ opacity: 1, scale: 1, x:0 }}
     transition={{ duration: 1 }} className='text-xl text-center font-bold cursor-pointer'>Join the community</motion.h1>
     </div>
       </CarouselItem>
       <CarouselItem>
       <div className='bg-gradient-to-t	from-purple-500 to-pink-500 h-screen'>
      
      <motion.h1 initial={{x:200, opacity: 0, scale: 0.5 }}
     animate={{ opacity: 1, scale: 1, x:0 }}
     transition={{ duration: 1 }} className='text-5xl mb-10 pt-[40vh] text-center font-bold'>Connect with Like-minded Engineers</motion.h1>
     <motion.h1 initial={{x:-200, opacity: 0, scale: 0.5 }}
     animate={{ opacity: 1, scale: 1, x:0 }}
     transition={{ duration: 1 }} className='text-xl text-center font-bold cursor-pointer'>Join the community</motion.h1>
     </div>
       </CarouselItem>
      </CarouselContent>
    </Carousel>
    </div>
  )
}

export default HeroCarousel
