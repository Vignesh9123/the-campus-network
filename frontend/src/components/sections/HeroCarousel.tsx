import React,{useRef, useEffect} from 'react'
import { motion , useScroll,useAnimation, useInView} from "framer-motion";
import Autoplay from "embla-carousel-autoplay"
import LoginButton from '../modules/LoginButton';
import { Button } from '../ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import { Card, CardContent } from "@/components/ui/card"
const HeroCarousel = () => {
  const controls = useAnimation();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const is1InView = useInView(ref1,{});
  const is2InView = useInView(ref2,{});
  // useEffect(() => {
  //   if (isInView) {
  //     controls.start("visible");
  //   }
  // }, [isInView]);
  return (
    <div>
      <Carousel  plugins={[
        Autoplay({
          delay: 7000,
        }),
      ]} className="w-full max-w-screen">
      <CarouselContent className="--1">
       <CarouselItem>
       <div ref={ref1} className='bg-cover carousel1 bg-center h-screen  ' >
      
      <motion.h1 style={{
          transform: is1InView ? "none" : "translateX(-100px)",
          opacity: is1InView ? 1 : 0,
  
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }} className='text-5xl mb-10 pt-[40vh] text-center font-bold'>Welcome to Campus Chronicles</motion.h1>
     <motion.h1 style={{
          transform: is1InView ? "none" : "translateX(-100px)",
          opacity: is1InView ? 1 : 0,

          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }} className='text-xl text-center font-bold cursor-pointer'>
          <div className="flex justify-center items-center gap-2">

          <LoginButton></LoginButton>
        <Button variant={"outline"} className='p-5'>Learn more</Button>
          </div>
        </motion.h1>
     </div>
       </CarouselItem>
       <CarouselItem>
       <div ref={ref2} className='bg-repeat-x carousel2 bg- h-screen'>
      
      <motion.h1 style={{
          transform: is2InView ? "none" : "translateX(-100px)",
          opacity: is2InView ? 1 : 0,
     
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }} className='text-5xl mb-10 pt-[40vh] text-center font-bold'>Connect with Like-minded Engineers</motion.h1>
     <motion.h1 style={{
          transform: is2InView ? "none" : "translateX(-100px)",
          opacity: is2InView ? 1 : 0,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }} className='text-xl text-center font-bold cursor-pointer'>
          <div className="flex justify-center items-center gap-2">

          <LoginButton></LoginButton>
        <Button variant={"outline"} className='p-5'>Learn more</Button>
          </div>
        </motion.h1>
     </div>
       </CarouselItem>
      </CarouselContent>
    </Carousel>
    </div>
  )
}

export default HeroCarousel