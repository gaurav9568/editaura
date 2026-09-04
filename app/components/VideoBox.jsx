
const VideoBox = ({ links }) => {
    return (
        <div className='grid grid-cols-1 grid-rows-4 md:grid-rows-2 md:grid-cols-2 gap-x-7 gap-y-5'>
            {
                links.map((link,i) => (
                    <div key={i} className = 'hover:scale-105 duration-100 ease-out h-[192px] w-[300px] lg:h-[256px] lg:w-[400px] xl:h-80 xl:w-[500px] p-3 rounded-2xl outline-1 outline-gray-900'>
                        <iframe
                            className="w-full h-full"
                            src={link}
                            title="YouTube video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ))
            }

        </div>
    )
}

export default VideoBox
