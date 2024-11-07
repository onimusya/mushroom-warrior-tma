import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from 'axios';


import Tele_Header from '../components/Tele_Header';

//import HeroSection from '../components/HeroSection';
//import TribalLegendSection from '../components/TribalLegendSection';
//import HowToPlaySection from '../components/HowToPlaySection';
//import MediaSection from '../components/MediaSection';
import Tele_FeatureSection from '../components/Tele_FeatureSection';
import Tele_Footer from '../components/Tele_Footer';
import "./Home.css";

import { useInitData, useUtils } from '@telegram-apps/sdk-react';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { UrlHashContext, TonConnectUiContext } from '../utils/Context';

function Tele_Home() {
  const utils = useUtils();

  const initData = useInitData();
  console.log(`[Tele_Home] key`, process.env.REACT_APP_API_KEY);
  console.log(`[Tele_Home] iv`, process.env.REACT_APP_API_IV);

  console.log(`[Tele_Home] initData:`, initData);
  console.log(`[Tele_Home] startParam:`, initData.startParam);
  
  const urlHash = useContext(UrlHashContext);

  console.log(`[Tele_Home] urlHash: `, urlHash);

  const gameUrl = process.env.REACT_APP_GAME_URL + "#" + urlHash;

  useEffect(() => {

    if (initData == null) {
      // Alert no user info
      withReactContent(Swal).fire({
        title: "Error!",
        text: "Missing Telegram user information data.",
        icon: "error",
      });

    } else {
      let params = {
        "userId": initData.user.id,
        "firstName": initData.user.firstName,
        "lastName": initData.user.lastName,
        "username": initData.user.username,
        "startapp": initData.startParam,
        "is_premium": initData.user.isPremium
      }
      
      if (initData.startParam) {
        params["startapp"] = initData.startParam
      } else {
        params["startapp"] = "";
      }

      if (initData.user.isPremium) {
        params["is_premium"] = initData.user.isPremium
      } else {
        params["is_premium"] = false
      }
      
      // encrypt params
      const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_API_KEY);
      const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_API_IV);

      console.log(`[Tele_Home] params:`, params);
      console.log(`[Tele_Home] key:`, key);
      console.log(`[Tele_Home] iv:`, iv);

      let encrypted = CryptoJS.AES.encrypt(JSON.stringify(params), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();

      console.log(`[Tele_Home] Encrypted Params:`, encrypted);

      // Call Api
      async function fetchData() {
        
        console.log(`[Tele_Home][fetchData] Update referrer...`);
        await axios.post(process.env.REACT_APP_API_URL + "invites/shareInviteUsers", {
          "data": encrypted 
        }).then(response => {
          console.log(`[Tele_Home][api][shareInviteUsers] Response:`, response);

          let resp = response.data;
          console.log(`[Tele_Home][api][shareInviteUsers] Resp:`, resp.data);

        }).catch(error => {
          console.log(`[Tele_Home][api][shareInviteUsers] Error:`, error);
        
        });          

      }

      fetchData();
    }

  }, []);


  return (
    
    <div className="home-page">
      <Tele_Header />
      <HeroSection gameUrl={gameUrl} />
      <TribalLegendSection />
      <HowToPlaySection />
      <Tele_FeatureSection />
      <Tele_Footer />

    </div>
        
  );
}

const Section = ({ children, bgImage }) => (
  <div
    className="w-full min-h-[300px]  bg-cover bg-center bg-no-repeat flex items-center justify-center"
    style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${bgImage})` }}
  >
    {children}

  </div>
);

const HeroSection = ({ gameUrl }) => (
  <Section bgImage="bg-1.webp" className="" alt="Hero">
    <div className="flex flex-col items-center h-full justify-between ">
      <div className=" flex flex-row items-center mt-16">
        <img src={`${process.env.PUBLIC_URL}/3000.png`} alt="3000" className="h-[30px] md:h-[60px] mr-2 md:mr-4" />
        <img src={`${process.env.PUBLIC_URL}/free-pulls.png`} alt="free pulls" className="h-[30px] md:h-[60px]" />
      </div>
      <div className="mt-[150px]  mb-1 flex flex-col items-center">
      
      <Link to={gameUrl} className="bg-contain bg-center bg-no-repeat w-[100px]  h-[60px] "
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/but-play.png)` }}>
          
        </Link>

      </div>
    </div>
  </Section>
);

const TribalLegendSection = () => (
  <Section bgImage="bg-2.webp" >
    <div className="flex flex-col items-center justify-center text-center h-[350px]">
      <h1 className="text-3xl md:text-5xl font-['Impact'] font-normal text-white mb-6 md:mb-12">Tribal Legend</h1>
      <img src={`${process.env.PUBLIC_URL}/icon-mushroom.png`} alt="Mushroom" className="w-12 md:w-12 mb-6 md:mb-8" />
      <p className="text-white text-xs mx-4 mb-4">
        Eons ago, the peaceful forest was attacked by mutant monsters. The brave Mushroom Warriors and their friends fight hard. They used the power of nature to drive away the evil dragon and achieve final victory.
      </p>
      <h2 className="text-xl  font-['Impact'] font-normal text-white mb-2">Come on!</h2>
      <p className="text-white text-sm ">
        Join us become a Mushroom Warrior!
      </p>
      <p className="text-white text-sm ">
        Letsssss fight!
      </p>
    </div>
  </Section>
);

const HowToPlaySection = () => (
  <Section bgImage="bg-3.webp">
    <div className="flex flex-col items-center justify-center   h-[350px]">
      <h1 className="text-3xl font-['Impact'] font-normal text-white mb-3 ">How to Play</h1>
      <h2 className="text-2xl font-['Impact'] font-normal text-white mb-3 ">Here are the steps</h2>
      <ul className="space-y-2 md:space-y-4 text-white">
        <li className="text-sm  font-['Impact'] font-normal pl-5">Login to your telegram account.</li>
        <li className="text-sm font-['Impact'] font-normal pl-5">Link to @Mushcoin_bot</li>
        <li className="text-sm font-['Impact'] font-normal pl-5">Start to Play Mushroom Warrior.</li>
        <li className="text-sm font-['Impact'] font-normal pl-5">Kill mutated monsters and earn golds and diamonds and $MUSH with your friends.</li>
      </ul>
    </div>
  </Section>
);

const MediaSection = () => (
  <Section bgImage="bg-4.webp">
    <div>
      <h1 className="text-5xl md:text-5xl font-['Impact'] font-normal text-white mb-6 md:mb-12 text-center ">Media</h1>
      <iframe
        width="100%"
        height="200px"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>

  </Section>
);

export default Tele_Home;