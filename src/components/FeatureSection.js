import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const FeatureSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const images = [
    '/card.png',
    '/card.png',
    '/card.png',
    '/card.png',
    '/card.png'
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const getVisibleImages = () => {
    if (isMobile) {
      return [images[currentIndex]];
    } else {
      return [
        images[currentIndex % images.length],
        images[(currentIndex + 1) % images.length],
        images[(currentIndex + 2) % images.length]
      ];
    }
  };

  return (
    <div className="bg-cover bg-center h-screen flex flex-col justify-center" style={{backgroundImage: "url('/bg-5.webp')"}}>
      <h1 className="text-5xl md:text-5xl font-['Impact'] font-normal text-white mb-6 md:mb-12 text-center">Feature</h1>
      
      <div className="relative px-4 mx-auto w-full md:max-w-[1080px]">
        <div className="flex justify-center w-[70%] mx-auto">
          {getVisibleImages().map((src, index) => (
            <div key={index} className={`${isMobile ? 'w-full' : 'w-1/3'} px-2`}>
              <img src={src} alt={`Feature ${index + 1}`} className="w-full h-auto rounded-lg" />
            </div>
          ))}
        </div>
  
        <button 
          onClick={prevSlide} 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
        >
          <FaChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default FeatureSection;