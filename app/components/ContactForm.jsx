"use client"
import { useState } from "react"



const ContactForm = () => {


  const handleSubmit = async (e) => {
    e.preventDefault()

    setSendingMessage("Sending ...")

    const res = await fetch('/api/email', {
      method: 'POST',
      body: JSON.stringify({ firstname, lastname, email, message }),
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()

    if(res.ok){
      setPopup(data.message)
      setFirstName("")
      setLastName("")
      setMessage("")
      setEmail("")
    }else{
      setPopup("Failed")
    }

    setSendingMessage("")
  }

  const [firstname, setFirstName] = useState("")
  const [lastname, setLastName] = useState("")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [popupMessage, setPopup] = useState("")
  const [sendingMessage,setSendingMessage] = useState("")

  return (
    <>
      <form onSubmit={handleSubmit} className="flex py-4 w-full max-w-[700px] items-center flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <input className="outline-1 outline-gray-900 px-2 py-3 rounded-[5px] flex-1 bg-black text-white" value={firstname} onChange={e => setFirstName(e.target.value)} type="text" name="firstname" required placeholder="First Name" />
          <input className="outline-1 outline-gray-900 px-2 py-3 rounded-[5px] flex-1 bg-black text-white" value={lastname} onChange={e => setLastName(e.target.value)} type="text" name="lastname" required placeholder="Last Name" />
        </div>
        <input className="outline-1 outline-gray-900 w-full px-2 py-3 rounded-[5px] bg-black text-white" value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="Your Email" />
        <textarea className="outline-1 outline-gray-900 w-full resize-none px-2 py-3 rounded-[5px] bg-black text-white" value={message} onChange={e => setMessage(e.target.value)} name="message" required placeholder="Your Message" rows={5} />
        <button type="submit" className="bg-blue-600  py-2 px-3 rounded-xl hover:scale-105 duration-200 cursor-pointer">Submit</button>
        <div className="h-[20px]">{sendingMessage}</div>
      </form>
      {popupMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60">
            <div className="h-[140px] w-[240px] rounded-2xl bg-gray-900 border border-gray-700 flex flex-col items-center justify-center gap-6 p-6 text-center">
              <div className="text-gray-200 font-medium text-xl">{popupMessage}</div>
              <button onClick={()=>setPopup("")} className="bg-blue-600 text-white py-1 px-4 rounded-xl cursor-pointer">
                OK
              </button>
            </div>
          </div>



      )}
    </>

  )
}

export default ContactForm
