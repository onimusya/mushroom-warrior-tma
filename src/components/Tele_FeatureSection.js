import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Tele_FeatureSection = () => {
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
    '/screenshots/1.jpg',
    '/screenshots/2.jpg',
    '/screenshots/3.jpg',
    '/screenshots/4.jpg',
    '/screenshots/5.jpg',
    '/screenshots/6.jpg',
    '/screenshots/7.jpg',
    '/screenshots/8.jpg',
    '/screenshots/9.jpg',
    '/screenshots/10.jpg',
    '/screenshots/11.jpg',
    '/screenshots/12.jpg',
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
        images[(currentIndex + images.length - 1) % images.length],
        images[currentIndex],
        images[(currentIndex + 1) % images.length]
      ];
    }
  };

  return (
    <div className="bg-cover bg-center h-[500px] flex flex-col " style={{ backgroundImage: "url('/bg-5.webp')" }}>
      <h1 className="text-3xl font-['Impact'] font-normal text-white mb-6 text-center">Feature</h1>

      <div className="relative px-4 mx-auto w-full">
        <div className="flex justify-center w-[70%] mx-auto">
          {getVisibleImages().map((src, index) => (
            <div key={`${currentIndex}-${index}`} className={`w-${isMobile ? 'full' : '1/3'} px-2 transition-all duration-300 ease-in-out`}>
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

export default Tele_FeatureSection;