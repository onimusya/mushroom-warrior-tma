import React, { useState, useEffect } from 'react';
import Tele_Header from '../components/Tele_Header';
import Tele_Footer from '../components/Tele_Footer';
import AirdropSection from '../components/AirdropSection';
import "./Home.css";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import CryptoJS from 'crypto-js';
import axios from 'axios';
import { DribbleLoader } from "react-tailwind-loaders";

import { useUtils, useHapticFeedback, useInitData, useLaunchParams } from '@telegram-apps/sdk-react';

function Tele_Rank() {
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(0);
  const [myPoint, setMyPoint] = useState(0);
  const [allRanks, setAllRanks] = useState([]);
  const [inviteUrl, setInviteUrl] = useState("");
  
  const lp = useLaunchParams();
  const initData = useInitData();
  console.log(`[Tele_Rank] initData: `, initData);

  const utils = useUtils();
  const hapticFeedback = useHapticFeedback();

  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  })  
 
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
        "userId": initData.user.id
      }
  
      // encrypt params
      const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_API_KEY);
      const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_API_IV);

      console.log(`[Tele_Rank] key`, key);
      console.log(`[Tele_Rank] iv`, iv);
      
      let encrypted = CryptoJS.AES.encrypt(JSON.stringify(params), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();
  
      console.log(`[Tele_Rank] Encrypted Params:`, encrypted);    
  
      // Test decrypt
      /*
      let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
  
      console.log(`[tele_rank] Decrypted Params:`, decrypted);
       */

      // Call Api
      async function fetchData() {
        // get my account info
        console.log(`[Tele_Rank][fetchData] Get my account info...`);
        await axios.post(process.env.REACT_APP_API_URL + "invites/getAbout", {
          "data": encrypted 
        }).then(response => {
          console.log(`[Tele_Rank][api][getAbout] Response:`, response);

          let resp = response.data;
          if (resp.data.myRewards.rank == null) resp.data.myRewards.rank = 0;
          if (resp.data.myRewards.point == null) resp.data.myRewards.point = 0;

          setMyRank(resp.data.myRewards.rank);
          setMyPoint(resp.data.myRewards.point);
          setInviteUrl(resp.data.shareInviteUrl);
          setLoading(false);

        }).catch(error => {
          console.log(`[Tele_Rank][api][getAbout] Error:`, error);
          setLoading(false);
        
        });  

        // get top 100 rank list
        console.log(`[Tele_Rank][fetchData] Get 100 rank data...`);
        await axios.post(process.env.REACT_APP_API_URL + "invites/inviteTopList", {
        
        }).then(response => {
          console.log(`[Tele_Rank][api][inviteTopList] Response:`, response);
          setAllRanks(response.data.data);

        }).catch(error => {
          console.log(`[Tele_Rank][api][inviteTopList] Error:`, error);
        
        });

      }
  
      if (lp.platform == "ios") {
        console.log(`[Tele_Rank] Delay 5s for ios to fetch data...`);
        setTimeout(fetchData, 2000);
      } else {
        fetchData();
      }

    }
  

  }, []);

  function handleInviteFriend() {

    console.log(`[Tele_Rank][handleInviteFriend] inviteUrl:`, inviteUrl);

    utils.shareURL(inviteUrl, "Let fight with Mushroom Warriors together and earn airdrop.");

  }

  function handleCopyInviteUrl() {
    console.log(`[Tele_Rank][handleCopyInviteUrl] inviteUrl:`, inviteUrl);
    navigator.clipboard.writeText(inviteUrl);
    hapticFeedback.notificationOccurred('success');

    withReactContent(Toast).fire({
      icon: 'info',
      title: 'Success copy invite url to clipboard.',
    })

  }

  return (
    <>
    
    <div className="flex flex-col w-full bg-[#0D0D0D] items-center justify-center">
      <div className='w-full max-w-[800px] color-[#FFA500]'>
        <Tele_Header />
        <TopSection myPoint={myPoint} myRank={myRank} allRanks={allRanks} handleInviteFriend={handleInviteFriend} handleCopyInviteUrl={handleCopyInviteUrl} />
        <AirdropSection inviteUrl={inviteUrl} />
        <Tele_Footer />
      </div>
    </div>

    </>
  );
}

const TopSection = ({myPoint, myRank, allRanks, handleInviteFriend, handleCopyInviteUrl }) => (
  <div className="top-section z-10">
    <div className="house-image w-full flex flex-col items-center justify-end min-h-[300px] md:min-h-[400px]" style={{ backgroundImage: "url('/rank-bg1.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>

    <div className="flex flex-col justify-center items-center text-white pb-4 text-left">
        <div className='flex flex-row gap-4'>
          <img src={`${process.env.PUBLIC_URL}/invite-your-friend.png`} alt="Invite your friend" className="w-48" onClick={handleInviteFriend} />
          <img src={`${process.env.PUBLIC_URL}/copy-icon.png`} alt="Copy icon" className="w-16 " onClick={handleCopyInviteUrl} />
        </div>
      </div>

      <img className='-mb-16 md:-mb-24 w-36 md:w-48' src={`${process.env.PUBLIC_URL}/rank-logo-01.png`} alt="Rank Logo" />
    </div>
    <div className="bg-[#ffffff] p-4 flex flex-col items-center mx-auto justify-center rounded-2xl -mt-8">
      <div className="flex flex-row items-center h-[150px] md:h-[200px] justify-center w-full max-w-[400px] mt-8 md:mt-12">
        <div className="flex flex-col mr-8 text-center">
          <div className="label text-orange-500">Your Points</div>
          <div className="label text-orange-500 text-xl md:text-2xl font-bold">{myPoint.toLocaleString('en-US')}</div>
        </div>
        <div className="flex flex-col text-center">
          <div className="label text-orange-500">Your Rank</div>
          <div className="label text-orange-500 text-xl md:text-2xl font-bold">{myRank}</div>
        </div>
      </div>

      <RankTable allRanks={allRanks} />
    </div>
  </div>
);

const RankTable = ({ allRanks }) => {
  const [showAllRankings, setShowAllRankings] = useState(false);

  /*
  const rankings = [
    { rank: 1, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649, icon: '👑' },
    { rank: 2, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649, icon: '🔵' },
    { rank: 3, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649, icon: '🛡️' },
    { rank: 4, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649, icon: '🟣' },
    { rank: 5, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649, icon: '🟤' },
    { rank: 6, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    { rank: 7, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    { rank: 8, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    // ... Add more rankings up to 100
    { rank: 9, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    { rank: 10, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    { rank: 11, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    { rank: 12, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    { rank: 13, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    { rank: 14, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    { rank: 15, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    { rank: 16, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    { rank: 17, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    { rank: 18, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    { rank: 19, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
  ];
  
  */
  // const displayedRankings = showAllRankings ? rankings : rankings.slice(0, 8);

  const displayedRankings = showAllRankings ? allRanks : allRanks.slice(0, 10);
  if (displayedRankings[0]) {
    displayedRankings[0].icon = '/icons/rank-01.png'
  }
  
  if (displayedRankings[1]) {
    displayedRankings[1].icon = '/icons/rank-02.png'
  }

  if (displayedRankings[2]) {
    displayedRankings[2].icon = '/icons/rank-03.png'
  }

  if (displayedRankings[3]) {
    displayedRankings[3].icon = '/icons/rank-04.png'
  }

  if (displayedRankings[4]) {
    displayedRankings[4].icon = '/icons/rank-05.png'
  }

  console.log(`[tele_rank][RankTable] Display Rank:`, displayedRankings);

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-xs md:text-sm leading-normal">
            <th className="py-2 px-3 md:py-3 md:px-6 text-center">Rank</th>
            <th className="py-2 px-3 md:py-3 md:px-6 text-left">Player</th>
            <th className="py-2 px-3 md:py-3 md:px-6 text-right">Total Reward</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-xs md:text-sm font-light">
          {displayedRankings.map((rank, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-2 px-3 md:py-3 md:px-6 text-center whitespace-nowrap flex items-center justify-center">
                {rank.icon ? (
                  <img className='w-4 h-4' src={rank.icon} alt="Rank Icon" />
                ) : (
                  <span className="font-medium">{rank.rank}</span>
                )}
              </td>
              <td className="py-2 px-3 md:py-3 md:px-6 text-left">{rank.player}</td>
              <td className="py-2 px-3 md:py-3 md:px-6 text-right">{rank.cumulation.toLocaleString('en-US')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button 
        className="more-rank-button w-full py-3 px-4 text-base font-semibold text-[#49241B] text-center flex flex-col items-center justify-center "
        onClick={() => setShowAllRankings(!showAllRankings)}
      >
         <svg
          className={`ml-2 w-[22px] h-[14px] transition-transform duration-200 ${showAllRankings ? 'rotate-180' : ''}`}
          width="22" 
          height="14" 
          viewBox="0 0 22 14" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M3.1814 1H18.8202C20.0241 1 21 1.96 21 3.148C21 3.718 20.77 4.264 20.3601 4.668L12.5447 12.37C11.6927 13.21 10.3128 13.21 9.46091 12.37L1.63952 4.668C1.23054 4.26802 1 3.72008 1 3.148C1 2.57592 1.23054 2.02798 1.63952 1.628C2.04949 1.23 2.60344 1 3.1814 1Z" 
            fill="url(#paint0_linear_0_400)" 
            stroke="#49241B"
          />
          <defs>
            <linearGradient id="paint0_linear_0_400" x1="1.12089" y1="1" x2="1.12089" y2="12.8549" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F29904"/>
              <stop stopColor="#EC9400"/>
              <stop offset="1" stopColor="#FFDD72"/>
            </linearGradient>
          </defs>
        </svg>
        
        {showAllRankings ? 'Show Less' : 'More Rank List'}
       
      </button>
    </div>
  );
};



export default Tele_Rank;