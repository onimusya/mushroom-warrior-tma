const TribalLegendSection = () => {
    return (
        <div className="relative   overflow-hidden flex flex-col items-center h-screen  "
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/bg-2.webp)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>

            <div className="flex flex-col flex-start items-center justify-center w-full max-w-[1080px] w-full ">
                <div className="mt-[10rem] mb-12">
                    <h1 className="text-5xl font-['Impact'] font-normal text-white">Tribal Legend</h1>
                </div>
                <div>
                   <img src={`${process.env.PUBLIC_URL}/icon-mushroom.png`} />
                </div>
                <div className="text-center mt-16">
                    <p>
                    Eons ago, the peaceful forest was attacked by mutant monsters. The brave Mushroom Warriors and their friends fight hard.They used the power of nature to drive away the evil dragon and achieve final victory.


                    </p>
                    <h2 className="text-5xl font-['Impact'] font-normal text-white">Come on!</h2>
                    <p>
                    Join us become a Mushroom Warrior!
                   
                    </p>
                    <p>
                    Letsssss fight! 
                    </p>
                </div>
               

            </div>

        </div>
    );
}

export default TribalLegendSection;
