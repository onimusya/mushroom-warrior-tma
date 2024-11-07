import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);

  const navItems = ['Home', 'How to Play', 'Media', 'Feature'];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (e, item) => {
    e.preventDefault();
    const element = document.getElementById(item.toLowerCase().replace(/\s+/g, '-'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`
      ${isSticky ? 'fixed top-0 bg-[#001D42] shadow-md' : 'absolute'} 
      left-0 right-0 flex items-center p-4 z-50 transition-all duration-300 ease-in-out
    `}>
      <div className="max-w-[1080px] mx-auto flex items-center w-full">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="w-16 h-16 mr-10" />
        <nav className="flex justify-around w-full font-['Impact'] font-normal text-white text-xl">
          {navItems.map(item => (
            <a 
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={(e) => handleNavClick(e, item)}
              className="hover:text-yellow-500 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;