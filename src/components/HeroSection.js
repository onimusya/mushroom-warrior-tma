const HeroSection = () => {
    return (
        <div className="relative   overflow-hidden flex items-center h-screen "
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/bg-1.webp)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>

            <div className="relative flex flex-col items-center w-full h-full justify-between ">
                <div className="mt-[10rem] flex flex-row items-center">
                   
                   <img src={`${process.env.PUBLIC_URL}/3000.png`} alt="3000" className="h-[60px] mr-4"/>
                   <img src={`${process.env.PUBLIC_URL}/free-pulls.png`} alt="free pulls" className="h-[60px]"/>
                </div>
                <div className="-mt-8 mb-4 flex flex-col items-center">
                    <button className="px-12 py-3  text-white text-xl rounded-full shadow-lg hover:bg-yellow-500 transition z-10"
                        style={{
                            backgroundImage: `url(${process.env.PUBLIC_URL}/button1.png)`

                        }}>
                        play
                    </button>
                    <image src={`${process.env.PUBLIC_URL}/button2.png`} alt="button2" width={58} height={38} />


                </div>

            </div>

        </div>
    );
}

export default HeroSection;
