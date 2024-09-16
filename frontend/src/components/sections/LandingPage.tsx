import React, {useState, useRef, useEffect} from 'react'
import NavBar from './NavBar'
import { motion , useScroll, useInView, useAnimation} from "framer-motion";
import HeroCarousel from './HeroCarousel';
import { ContainerScroll } from '../ui/hero-scroll';
const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const [navVisible, setNavVisible] = useState(false)
  scrollYProgress.on("change",(e) => {
    if (e > 0.2) {
      setNavVisible(true)
    } else {
      setNavVisible(false)
    }
  });
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);
  
  
  return (
    <div className='' >
      {/* <HeroCarousel/> */}
      
       <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
            Where graduates connect and share their true  <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
              college journeys.
              </span>
            </h1>
          </>
        }
      >
        <img
          src={`/hero.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
      <div className='w-[98vw] h-[1px] bg-gray-800' /> 
     <motion.div initial={navVisible?{opacity:1}:{opacity:0}} animate={navVisible?{opacity:1}:{opacity:0}} transition={{duration:0.5}}>
      <NavBar className={navVisible ? "visible fixed top-0 m-0 w-screen p-3" : "hidden"}/>
      </motion.div>
      <div className='h-[90vh]' ref={ref}>
        <motion.div style={{
          transform: isInView ? "none" : "",
          opacity: isInView ? 1 : 0,
          scale: isInView ? 1 : 0.5,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }} className='font-bold text-center text-6xl pt-[30vh]'>
          Join Our Community
        </motion.div>
        <motion.div style={{
          transform: isInView ? "none" : "",
          opacity: isInView ? 1 : 0,
          scale: isInView ? 1 : 0.5,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }} className='text-center w-[50vw] mx-auto pt-5 text-[19px]'>
       The Campus Network is a central hub where engineering students from various disciplines can connect and share their knowledge through blogs. It conveys a sense of community and collaboration, which is ideal for the purpose of the website.
        </motion.div>
      <div className=''>
      
      </div>

      </div>

      
    
    </div>
  )
}

export default LandingPage
