import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from 'axios';

import "./Home.css";

function Tele_Error() {


  return (
    
    <div className="home-page">
      <div className="h-screen flex flex-col items-center justify-center">
        <div className='flex flex-col gap-4'>
          <img src="/logo.png" alt="alternate text" className="m-auto" />
          <a href="https://t.me/NotMushCoin_bot">
            <div className=" py-2 px-4 flex flex-row items-center bg-contain bg-center bg-no-repeat justify-center  mb-1 h-[100px] w-full" style={{ backgroundImage: "url('/earn-button-bg.png')" }}>
              <span className="text-white text-sm">Click here to Mushroom Warrior Bot</span>
            </div>
          </a>
        </div>
      </div>      
    </div>
        
  );
}


export default Tele_Error;