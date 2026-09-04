import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

const contacts = [
    {
        name:"Whatsapp",
        icon:"/whatsapp.png",
        link:"https://wa.me/923254795024",
        alt:"Whatsapp Image"
    },
    {
        name:"Instagram",
        icon:"/instagram.png",
        link:"https://www.instagram.com/premieredits.studio?igsh=dDdsaGEyMHE3MjQy",
        alt:"Instagram Image"
    },
    {
        name:"Linkedin",
        icon:"/linkedin.png",
        link:"https://www.linkedin.com/in/shamail-ahmed-375551198/",
        alt:"Linkedin Image"
    }

]

const ContactCards = () => {
  return (
    <div className='flex items-center justify-center gap-10'>
        {contacts.map((contact,i)=>(
        <Link target='_blank' href={contact.link} key={i} className='relative overflow-hidden h-[50px] w-[50px] md:h-[80px] md:w-[80px] flex flex-col items-center justify-center gap-5 outline-1 outline-gray-900 rounded-2xl hover:scale-105 duration-200 cursor-pointer'>
            {/* <div className="absolute top-0 -left-10 rounded-full h-20 w-20 bg-blue-600 blur-3xl" ></div> */}
            <div className='h-10 w-10 md:h-14 md:w-14'>
                <Image src={contact.icon} width={512} height={512} alt={contact.alt}/>
            </div>
            {/* <div className='text-3xl font-bold select-none'>{contact.name}</div> */}
        </Link>
        ))}
      
    </div>
  )
}

export default ContactCards
