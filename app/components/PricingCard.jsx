
const PricingCard = ({ p }) => {
  return (
    <>
      <div className="relative overflow-hidden h-[410px] py-2 px-2 w-[250px] xl:h-[470px] xl:w-[300px] rounded-2xl hover:scale-105 duration-200 select-none outline-1 outline-gray-900 ">
        <div className="absolute top-0 -left-10 rounded-full h-20 w-20 bg-blue-600 blur-3xl" ></div>
        <div className="absolute bottom-0 -right-10 rounded-full h-20 w-20 bg-blue-600 blur-3xl" ></div>
        <div className="h-3/12 flex items-center justify-center">
          <div className="text-xl xl:text-2xl text-center">{p.name}</div>
        </div>
        <div className="h-3/12 py-2.5 flex flex-col items-center">
          <div className="text-5xl font-bold">{p.price}</div>
          <div>{p.billing}</div>
        </div>
        <div className="h-6/12">
          <ul className="list-disc ml-6">
            {p.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default PricingCard
