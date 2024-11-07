import React from 'react';
import Header from '../components/Header';
import FeatureSection from '../components/FeatureSection';
import Footer from '../components/Footer';
import "./Home.css";



function Home() {
  return (
    <div className="home-page">
      <Header />
      <div id="home">
        <HeroSection />
      </div>
      <div id="tribal-legend">
      <TribalLegendSection />
      </div>
      <div id="how-to-play">
        <HowToPlaySection />
      </div>
      <div id="media">
        <MediaSection />
      </div>
      <div id="feature">
        <FeatureSection />
      </div>
      <Footer />
    </div>
  );
}

const Section = ({ children, bgImage }) => (
  <div 
    className="w-full min-h-screen md:h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
    style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImage})` }}
  >
    <div className="w-full max-w-[1080px] px-4 py-8 md:py-0 h-full pt-12">
      {children }
    </div>
  </div>
);

const HeroSection = () => {
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('tribal-legend');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
  <Section bgImage="bg-1.webp" className="h-screen">
    <div className="flex flex-col items-center justify-between h-full">
      <div className="mt-20 md:mt-40 flex flex-row items-center">
        <img src={`${process.env.PUBLIC_URL}/3000.png`} alt="3000" className="h-[30px] md:h-[60px] mr-2 md:mr-4"/>
        <img src={`${process.env.PUBLIC_URL}/free-pulls.png`} alt="free pulls" className="h-[30px] md:h-[60px]"/>
      </div>
      <div className="mt-8 md:mt-0 mb-4 flex flex-col items-center">
        <button className="bg-contain bg-center bg-no-repeat w-[60px] md:w-[200px] h-[120px] hover:scale-110 transition"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/but-play.png)` }}>
          
        </button>
        <img 
            src={`${process.env.PUBLIC_URL}/button2.png`} 
            alt="button2" 
            className="w-[40px] md:w-[58px] mt-2 cursor-pointer" 
            onClick={scrollToNextSection}
          />
      </div>
    </div>
  </Section>
  );
};


const TribalLegendSection = () => (
  <Section bgImage="bg-2.webp">
    <div className="flex flex-col items-center justify-center text-center pt-[10rem]">
      <h1 className="text-3xl md:text-5xl font-['Impact'] font-normal text-white mb-6 md:mb-12">Tribal Legend</h1>
      <img src={`${process.env.PUBLIC_URL}/icon-mushroom.png`} alt="Mushroom" className="w-24 md:w-32 mb-6 md:mb-8" />
      <p className="text-white text-sm md:text-base mb-4">
        Eons ago, the peaceful forest was attacked by mutant monsters. The brave Mushroom Warriors and their friends fight hard. They used the power of nature to drive away the evil dragon and achieve final victory.
      </p>
      <h2 className="text-3xl md:text-5xl font-['Impact'] font-normal text-white mb-2">Come on!</h2>
      <p className="text-white text-sm md:text-base">
        Join us become a Mushroom Warrior!
      </p>
      <p className="text-white text-sm md:text-base">
        Letsssss fight! 
      </p>
    </div>
  </Section>
);

const HowToPlaySection = () => (
  <Section bgImage="bg-3.webp">
    <div className="flex flex-col items-center justify-center  pt-[10rem]">
      <h1 className="text-3xl md:text-5xl font-['Impact'] font-normal text-white mb-6 md:mb-12">How to Play</h1>
      <h2 className="text-2xl md:text-3xl font-['Impact'] font-normal text-white mb-6 md:mb-8">Here are the steps</h2>
      <ul className="space-y-2 md:space-y-4 text-white">
        <li className="text-lg md:text-2xl font-['Impact'] font-normal pl-5">Login to your telegram account.</li>
        <li className="text-lg md:text-2xl font-['Impact'] font-normal pl-5">Link to @Mushcoin_bot</li>
        <li className="text-lg md:text-2xl font-['Impact'] font-normal pl-5">Start to Play Mushroom Warrior.</li>
        <li className="text-lg md:text-2xl font-['Impact'] font-normal pl-5">Kill mutated monsters and earn golds and diamonds and $MUSH with your friends.</li>
      </ul>
    </div>
  </Section>
);

const MediaSection = () => (
  <Section bgImage="bg-4.webp">
    
    <h1 className="text-5xl md:text-5xl font-['Impact'] font-normal text-white mb-6 md:mb-12 text-center  mt-[10rem]">Media</h1>
    <iframe
        width="100%"
        height="600px"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
  </Section>
);




export default Home;