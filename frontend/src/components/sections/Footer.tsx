import { Linkedin } from "lucide-react"
import { Link } from "react-router-dom"
function Footer() {
  return (
    <div>
       <div className='footer'>
       <div className='flex gap-5 justify-center items-center '>
        <div>
          <img src="/TCN%20Logo%20WO%20BG.png" className='w-32' alt="" />
        </div>
        <div>
          <p className='font-bold text-xl'>The Campus Network</p>
          <p className='text-sm'>The Campus Network is a platform for students to connect and collaborate in projects and share their knowledge through blogs.</p>
        </div>
       </div>
       <div className='grid grid-cols-2 text-center  md:grid-cols-4 gap-5 items-center justify-center mt-5'>
        <div>
          <p className='font-bold text-lg md:text-xl'>Contact Me</p>
          <Link to={'mailto:vignesh.d9123@gmail.com'} className='text-sm'>Email: vignesh.d9123@gmail.com</Link>
        </div>
        <div>
          <p className='font-bold text-lg md:text-xl'>Follow Me</p>
          <Link to='https://www.linkedin.com/in/vignesh-d-a52272257/' target="_blank" className='text-sm mt-2 hover:text-blue-500 hover:underline duration-150 flex justify-center items-center gap-1'><Linkedin size={15} className="mb-[2px]"/> Linkedin</Link>
        </div>
        <div>
          <p className='font-bold text-lg md:text-xl'>Legal</p>
          <Link to='/terms-of-service' className='text-sm'>Terms of Service</Link>
        </div>
        <div>
          <p className='font-bold text-lg md:text-xl'>Privacy Policy</p>
          <Link to='/privacy-policy' className='text-sm'>Privacy Policy</Link>
        </div>
        {/* <div>
          <p className='font-bold text-lg md:text-xl'>About Me</p>
          <p className='text-sm'>About Me</p>
        </div> */}
       </div>
     
       <p className='text-center my-5'>© 2024 The Campus Network. All rights reserved.</p>

      
      </div>
    </div>
  )
}

export default Footer
