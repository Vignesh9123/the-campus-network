import {useState, MouseEvent} from 'react'
import NavBar from './NavBar'
import { motion , useScroll,useMotionTemplate, useMotionValue } from "framer-motion";
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { Info, User } from 'lucide-react';
import { FlipWords } from '../ui/flip-words';
import FeaturesSectionDemo from '../blocks/FeatureSection';
const LandingPage = () => {
  document.title = "The Campus Network"
  const { scrollYProgress } = useScroll();
  const [navVisible, setNavVisible] = useState(false)
  scrollYProgress.on("change",(e) => {
    if (e > 0.2) {
      setNavVisible(true)
    } else {
      setNavVisible(false)
    }
  });
  
  const TEXTS = ['Collaborative Endeavors', 'Creative Projects', 'Future-Driven Projects'];
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
    

  return (
    <div className='' >
      
           <div
      className="group flex flex-col lg:flex-row  items-center p-5 min-h-screen relative rounded-xl border border-white/10 bg-slate-300 dark:bg-gray-900 px-8 py-16 shadow-2xl"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.15),
              transparent 80%
            )
          `,
        }}
      />
            <div className="lg:w-1/2 p-5">
              <h1 className='text-4xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-7xl font-bold text-center '>Seamlessly Unite and Innovate on <FlipWords words={TEXTS} className='text-[#5271ff] dark:text-[#5271ff] block mx-auto min-h-[100px] md:min-h-max text-center'/> <br />

              </h1>
              <h3 className='text-md md:text-2xl lg:text-3xl font-semibold text-center mt-2 lg:mt-10'>Collaborate, Organize, and Track Project Progress with Your Team—all in One Place!</h3>
              <div className='flex mt-5 lg:mt-36 justify-around'>

              <Link to="/login" className="px-5 md:px-8 py-2 md:w-1/3  flex justify-center rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
                <User className='mr-2'/> Login
</Link>              <Link to="/about-the-site" className="relative md:w-1/3 inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
    <Info className='mr-2'/> Know More
  </span>
</Link>
              </div>

            </div>
            <div className="lg:w-1/2 mt-28 md:mt-0">
              <img src="/Hero Device Mockups.png" alt="" className='' />
            </div>

          </div>
     <motion.div initial={navVisible?{opacity:1}:{opacity:0}} animate={navVisible?{opacity:1,zIndex:10000}:{opacity:0}} transition={{duration:0.5}}>
      <NavBar className={navVisible ? "visible fixed z-50 top-0 m-0 w-screen p-3" : "hidden"}/>
      </motion.div>
      <FeaturesSectionDemo/>
      
     <Footer/>

      
    
    </div>
  )
}

export default LandingPage
