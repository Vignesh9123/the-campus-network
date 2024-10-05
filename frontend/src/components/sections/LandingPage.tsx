import {useState, useRef} from 'react'
import NavBar from './NavBar'
import { motion , useScroll, useInView} from "framer-motion";
import { ContainerScroll } from '../ui/hero-scroll';
import { BackgroundLines } from '../ui/background-lines';
import { Button } from '../ui/button';
import LoginButton from '../modules/LoginButton';
import { Separator } from '../ui/separator';
import { Link } from 'react-router-dom';
import Footer from './Footer';
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
  const ref = useRef(null);
  const isInView = useInView(ref);
  
  
  return (
    <div className='' >
      {/* <HeroCarousel/> */}
      <BackgroundLines className=''>
    <div className="flex gap-5 items-center justify-center pt-10">
      <Link to="/about-the-site"><Button variant="outline">Know More</Button></Link>
      <LoginButton/>
    </div>
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        className="flex flex-col overflow-hidden">

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
    </motion.div>
          </BackgroundLines>
     <motion.div initial={navVisible?{opacity:1}:{opacity:0}} animate={navVisible?{opacity:1}:{opacity:0}} transition={{duration:0.5}}>
      <NavBar className={navVisible ? "visible fixed z-50 top-0 m-0 w-screen p-3" : "hidden"}/>
      </motion.div>
      <div className='h-[80vh] -z-50 md:mt-64' ref={ref}>
        <motion.div style={{
          transform: isInView ? "none" : "",
          opacity: isInView ? 1 : 0,
          scale: isInView ? 1 : 0.5,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }} className='font-bold text-center text-3xl md:text-6xl pt-[30vh]'>
          Join Our Community
        </motion.div>
        <motion.div style={{
          transform: isInView ? "none" : "",
          opacity: isInView ? 1 : 0,
          scale: isInView ? 1 : 0.5,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }} className='text-center w-[50vw] mx-auto pt-5 text-[16px] md:text-[19px]'>
       The Campus Network is a central hub where engineering students from various disciplines can connect and share their knowledge through blogs. It conveys a sense of community and collaboration, which is ideal for the purpose of the website.
        </motion.div>
        <Separator className='mt-24'/>

      </div>
     <Footer/>

      
    
    </div>
  )
}

export default LandingPage
