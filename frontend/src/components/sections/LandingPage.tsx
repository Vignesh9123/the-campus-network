import {useState, MouseEvent} from 'react'
import NavBar from './NavBar'
import { motion , useScroll,useMotionTemplate, useMotionValue } from "framer-motion";
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { Info, User } from 'lucide-react';
import { FlipWords } from '../ui/flip-words';
import FeaturesSectionDemo from '../blocks/FeatureSection';
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
      {/* <BackgroundLines className=''>
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
            <h1 className="text-2xl md:text-4xl font-semibold text-black dark:text-white">
            Connect, share, and collaborate on projects <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                with ease
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
          </BackgroundLines> */}
           <div
      className="group flex flex-col md:flex-row  items-center p-5 min-h-screen relative rounded-xl border border-white/10 bg-slate-300 dark:bg-gray-900 px-8 py-16 shadow-2xl"
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
            <div className="md:w-1/2 p-5">
              <h1 className='text-3xl lg:text-4xl xl:text-7xl font-bold text-center '>Seamlessly Unite and Innovate on <FlipWords words={TEXTS} className='text-[#5271ff] dark:text-[#5271ff] block mx-auto w-fit'/> <br />

              </h1>
              <h3 className='text-xl md:text-3xl font-semibold text-center mt-2 md:mt-10'>Collaborate, Organize, and Track Project Progress with Your Team—all in One Place!</h3>
              <div className='flex mt-5 md:mt-36 justify-around'>

              <Link to="/login" className="px-8 py-2 w-1/3 flex justify-center rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
                <User className='mr-2'/> Login
</Link>              <Link to="/about-the-site" className="relative w-1/3 inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
    <Info className='mr-2'/> Know More
  </span>
</Link>
              </div>

            </div>
            <div className="md:w-1/2">
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
