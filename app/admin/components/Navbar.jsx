"use client"
import Logout from './Logout'

const links = [
  { title: "Work", url: "work" },
  { title: "Packages", url: "packages" },
  { title: "FAQs", url: "faq" },
]

const Navbar = ({setPage}) => {
  return (
    <>
      <div className='flex h-16 w-screen z-40 fixed top-10 justify-center items-center'>
        <div className='flex justify-center items-center h-full rounded-xl outline-1 outline-[#1B1B1B] px-8 py-3 backdrop-blur-md backdrop-saturate-150 shadow-md' >
          <div className='flex'>
            {
              links.map((link) => (
                <button onClick={()=>setPage(link.url)} key={link.title} className='cursor-pointer transition-colors duration-300 ease-out hover:bg-[#444444] px-3 py-2 rounded-2xl'>{link.title}</button>
              ))
            }
            <Logout/>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
