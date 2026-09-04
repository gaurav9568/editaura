

const testimonials = [
  { name: "Lukas", designation: "Founder SAT MASTERCLASS", link: "https://www.youtube.com/embed/0rzJkZW7anE" },
  { name: "Tyler Lambers", designation: "CEO OASIS MEDIA SOLUTIONS", link: "https://www.youtube.com/embed/cnuCZqcfT6I" },
  { name: "Tony Martin", designation: "LIFESTYLE COACH", link: "https://www.youtube.com/embed/YUe883U18rc" },
  { name: "Rudy Perez", designation: "CEO Vantage Mindset", link: "https://www.youtube.com/embed/1TvwEQS0CnU" },
]


const Testimonials = () => {
  return (
    <>
      <div className="w-[300px] sm:w-[350px] md:w-[700px]">
        <div id="single testimonial" className="w-full h-[380px] md:h-[300px] overflow-hidden relative flex flex-col justify-between md:flex-row p-3 outline-1 outline-gray-900 rounded-xl hover:scale-105 duration-200 gap-4">
          <div className="absolute bottom-0 -right-10 blur-3xl w-40 h-20 bg-blue-600 rounded-full"></div>
          <iframe
            className="h-[50%] w-full md:h-full md:w-[70%]"
            src="https://www.youtube.com/embed/nTc3XN3EDPU"
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="w-full md:w-[30%] flex flex-col justify-between">
            <div className="italic">“Whenever we send him a project and he puts his fingertips on it and his fingerprints in it, then the value goes up.”</div>
            <div className="mt-3">
              <div>- Tom Ziglar</div>
              <div className="italic text-sm text-gray-500">CEO Zig Ziglar Corporation</div>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-rows-4 grid-cols-1 md:grid-rows-2 md:grid-cols-2 gap-x-4 gap-y-4">
          {
            testimonials.map((testimonial, i) => (
              <div key={i} className='hover:scale-105 duration-100 ease-out p-3 rounded-2xl outline-1 outline-gray-900'>
                <iframe
                  className="w-full"
                  src={testimonial.link}
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                  <div className="mt-2">- {testimonial.name}</div>
                  <div className="italic text-sm text-gray-500">{testimonial.designation}</div>
              </div>
            ))
          }
        </div>
      </div>




      {/* <div id="testimonials" className="w-[800px] grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-5">
        {
          testimonials.map((testimonial, i) => (
            <TestimonialCard key={i} testimonial={testimonial} index={i} />
          ))
        }
      </div> */}
    </>
  )
}

export default Testimonials
