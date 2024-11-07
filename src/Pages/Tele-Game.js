import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from 'axios';

import Tele_FeatureSection from '../components/Tele_FeatureSection';
import Tele_Footer from '../components/Tele_Footer';
import "./Home.css";

import { useInitData, useUtils } from '@telegram-apps/sdk-react';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { UrlHashContext } from '../utils/Context';

function Tele_Game() {
  const utils = useUtils();

  const initData = useInitData();
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

      console.log(`[Tele_Game] params:`, params);
      console.log(`[Tele_Game] key:`, key);
      console.log(`[Tele_Game] iv:`, iv);

      let encrypted = CryptoJS.AES.encrypt(JSON.stringify(params), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();

      console.log(`[Tele_Home] Encrypted Params:`, encrypted);

      // Call Api
      async function fetchData() {
        
        console.log(`[Tele_Game][fetchData] Update referrer...`);
        await axios.post(process.env.REACT_APP_API_URL + "invites/shareInviteUsers", {
          "data": encrypted 
        }).then(response => {
          console.log(`[Tele_Game][api][shareInviteUsers] Response:`, response);

          let resp = response.data;
          console.log(`[Tele_Game][api][shareInviteUsers] Resp:`, resp.data);

        }).catch(error => {
          console.log(`[Tele_Game][api][shareInviteUsers] Error:`, error);
        
        });  
        
        window.location.replace(gameUrl);

      }

      fetchData();
    }

  }, []);


  return (
    
    <div className="home-page">
      <div class="h-screen flex items-center justify-center">
        <a href={gameUrl}>
          <img src="/logo.png" alt="alternate text" class="m-auto" />
        </a>
      </div>      
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
        Loading Mushroom Warrior ...
      </div>
      <div className="mt-[150px]  mb-1 flex flex-col items-center">      
        <Link to={gameUrl} className="bg-contain bg-center bg-no-repeat w-[100px]  h-[60px] "
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/but-play.png)` }}>        
        </Link>

      </div>
    </div>
  </Section>
);

export default Tele_Game;