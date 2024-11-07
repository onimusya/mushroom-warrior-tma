const HowToPlaySection = () => {
    return (
        <div className="relative   overflow-hidden flex flex-col items-center h-screen  "
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/bg-3.webp)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>

            <div className="flex flex-col flex-start items-center justify-center w-full max-w-[1080px] w-full ">
                <div className="mt-[10rem] mb-12">
                    <h1 className="text-5xl font-['Impact'] font-normal text-white">How to Play</h1>
                </div>

                <div className=" mt-16">
                    <h2 className="text-3xl font-['Impact'] font-normal text-white mb-12">Here are the steps</h2>
                    <ul className="custom-bullet space-y-4">
                        <li className="text-2xl font-['Impact'] font-normal text-white pl-5">Login to your telegram account.</li>
                        <li className="text-2xl font-['Impact'] font-normal text-white pl-5">Link to @Mushcoin_bot</li>
                        <li className="text-2xl font-['Impact'] font-normal text-white pl-5">Start to Play Mushroom Warrior.</li>
                        <li className="text-2xl font-['Impact'] font-normal text-white pl-5">Kill mutated monsters and earn golds and diamonds and $MUSH with your friends.</li>
                    </ul>
                </div>


            </div>

        </div>
    );
}

export default HowToPlaySection;
