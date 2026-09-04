"use client"
import { motion} from "motion/react"
import Link from "next/link"

const AboutButtons = () => {
  return (
    <>
    <div className="flex gap-4">
        <motion.div className='flex items-center justify-center bg-blue-600 rounded-2xl'
            whileHover={{
                boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.6)",
                transition: { 
                duration: 0.2,
                ease: "easeOut" 
                }
            }}
        >
            <Link className=" py-3 px-4" href={"#contact"}>Hire Me</Link>
        </motion.div>
        {/* <motion.button className='px-4 py-3 gap-1 flex rounded-[8px] cursor-pointer'
        whileHover={{
            boxShadow: "0 0 0 4px rgba(50, 50, 50, 0.7)",
            transition: {
                duration:0.2,
                ease: "easeOut"
            }
        }}
        >
            Learn More 
        </motion.button> */}
    </div>

    </>
  )
}

export default AboutButtons
