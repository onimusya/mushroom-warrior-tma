import React, { useState, useEffect } from 'react';
import Tele_Header from '../components/Tele_Header';
import Tele_Footer from '../components/Tele_Footer';
import AirdropSection from '../components/AirdropSection';
import "./Home.css";

import CryptoJS from 'crypto-js';
import axios from 'axios';
import { useUtils, useHapticFeedback, useInitData, useLaunchParams } from '@telegram-apps/sdk-react';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


function Tele_Invite() {

  const [friends, setFriends] = useState([]);
  const [myGold, setMyGold] = useState(0);
  const [myDiamond, setMyDiamond] = useState(0);
  const [myMush, setMyMush] = useState(0);
  const [inviteUrl, setInviteUrl] = useState("");

  const lp = useLaunchParams();
  const initData = useInitData();
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

      console.log(`[Tele_Invite] key`, key);
      console.log(`[Tele_Invite] iv`, iv);

      let encrypted = CryptoJS.AES.encrypt(JSON.stringify(params), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();

      console.log(`[Tele_Invite] Encrypted Params:`, encrypted);

      // Call Api
      async function fetchData() {
        // get my account info
        console.log(`[Tele_Invite][fetchData] Get my friends list...`);
        await axios.post(process.env.REACT_APP_API_URL + "invites/getMyInviteFriends", {
          "data": encrypted
        }).then(response => {
          console.log(`[Tele_Invite][api][getFriends] Response:`, response);

          let resp = response.data;
          setFriends(resp.data);

        }).catch(error => {
          console.log(`[Tele_Invite][api][getFriends] Error:`, error);

        });

        console.log(`[Tele_Invite][fetchData] Get my account info...`);
        await axios.post(process.env.REACT_APP_API_URL + "invites/getAbout", {
          "data": encrypted
        }).then(response => {
          console.log(`[Tele_Invite][api][getAbout] Response:`, response);

          let resp = response.data;
          setMyGold(resp.data.inviteRewards.gold);
          setMyDiamond(resp.data.inviteRewards.diamond);
          setMyMush(resp.data.inviteRewards.mush);
          setInviteUrl(resp.data.shareInviteUrl);

        }).catch(error => {
          console.log(`[Tele_Invite][api][getAbout] Error:`, error);

        });

      }

      if (lp.platform == "ios") {
        console.log(`[Tele_Invite] Delay 5s for ios to fetch data...`);        
        setTimeout(fetchData, 2000);
      } else {
        fetchData();
      }

    }

  }, []);

  
  function handleInviteFriend() {

    console.log(`[Tele_Invite][handleInviteFriend] inviteUrl:`, inviteUrl);

    utils.shareURL(inviteUrl, "Let fight with Mushroom Warriors together and earn airdrop.");

  }

  function handleCopyInviteUrl() {
    console.log(`[Tele_Invite][handleCopyInviteUrl] inviteUrl:`, inviteUrl);
    navigator.clipboard.writeText(inviteUrl);
    hapticFeedback.notificationOccurred('success');

    withReactContent(Toast).fire({
      icon: 'info',
      title: 'Success copy invite url to clipboard.',
    })

  }


  return (
    <div className="home-page min-h-screen flex flex-col full-width">
      <Tele_Header />
      <div className="mx-auto ">
        <TotalBonuses gold={myGold} diamond={myDiamond} mush={myMush} />
        <InviteFriends handleInviteFriend={handleInviteFriend} handleCopyInviteUrl={handleCopyInviteUrl} />
        <BonusesTable friends={friends} />

        <AirdropSection inviteUrl={inviteUrl} />
        <Tele_Footer />
      </div>


    </div>
  );
}

const TotalBonuses = ({ gold, diamond, mush }) => (
  <div className="z-0 bg-white p-4 -mt-8 text-center relative min-h-[300px]" style={{ backgroundImage: "url('/invite-bg-01.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <h2 className="text-3xl font-bold mb-4 mt-20 text-white growing-outline-text">Your Total Bonuses</h2>
    <div className="flex flex-row justify-around mt-16">
      <div className="text-center flex flex-col ">
        <p className="text-1xl text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{gold}</p>
        <div className={`w-8 h-8 flex`}>
          <img src={`${process.env.PUBLIC_URL}/gold-coin.png`} alt="Gold Coin" className='w-6 h-6 mr-2' />
          <p className='text-white text-base'>Gold</p>
        </div>
      </div>
      <div className="text-center flex flex-col">
        <p className="text-1xl text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{diamond}</p>
        <div className={`w-8 h-8 flex`}>
          <img src={`${process.env.PUBLIC_URL}/diamond.png`} alt="Diamond" className='w-6 h-6 mr-2' />
          <p className='text-white text-base'>Diamond</p>
        </div>
      </div>
      <div className="text-center flex flex-col">
        <p className="text-1xl text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{mush}</p>
        <div className={`w-8 h-8 flex`}>
          <img src={`${process.env.PUBLIC_URL}/mush-coin.png`} alt="Mush Coin" className='w-6 h-6 mr-2' />
          <p className='text-white text-base'>Mush</p>
        </div>
      </div>
    </div>
  </div>
);

const InviteFriends = ({ handleInviteFriend, handleCopyInviteUrl }) => (
  <div className="bg-gradient-to-b from-white to-sky-100 rounded-3xl p-4 mb-4 shadow-md -mt-8 relative text-center flex flex-col">
    <h3 className="text-xl font-bold mb-2 text-[#FF8C00]">Invite friends !</h3>
    <p className="text-sm mb-4 text-gray-600">You and your friends will receive bonuses</p>
    <div className="flex flex-col justify-center items-center text-white p-4 text-left">
      <div className='flex flex-row gap-4'>
        <img src={`${process.env.PUBLIC_URL}/invite-your-friend.png`} alt="Invite your friend" className="w-48" onClick={handleInviteFriend} />
        <img src={`${process.env.PUBLIC_URL}/copy-icon.png`} alt="Copy icon" className="w-16 " onClick={handleCopyInviteUrl} />
      </div>
    </div>

    <div className="space-y-2">
      <InviteButton type="friend" />
      <InviteButton type="premium" />
    </div>
  </div>
);

const InviteButton = ({ type }) => (
  <button className={`w-full py-3 px-4 rounded-lg border-2 ${type === 'friend' ? 'border-[#FFA500]' : 'border-[#8A2BE2]'} flex items-center justify-between`}>
    <span className="font-semibold text-[#774600] text-sm">
      {type === 'friend' ? 'Invite a friend' : 'Invite a Premium'}
    </span>
    <div className="flex items-center space-x-2">
      <img src={`${process.env.PUBLIC_URL}/gold-coin.png`} alt="Gold Coin" className='w-6 h-6 mr-1' />
      <span className="text-sm font-semibold text-[#FF8C00]">{type === 'friend' ? "50,000" : "500,000"}</span>
      <img src={`${process.env.PUBLIC_URL}/diamond.png`} alt="Diamond" className='w-6 h-6 mr-1' />
      <span className="text-sm font-semibold text-[#FF8C00]">{type === 'friend' ? "2,000" : "20,000"}</span>
      <img src={`${process.env.PUBLIC_URL}/mush-coin.png`} alt="Mush Coin" className='w-6 h-6 mr-1' />
      <span className="text-sm font-semibold text-[#FF8C00]">{type === 'friend' ? "5,000" : "15,000"}</span>
    </div>
  </button>
);

const BonusesTable = ({ friends }) => (
  <div className=" rounded-lg p-4 mb-4 -mt-8 min-h-[1000px] flex flex-col items-center" style={{ backgroundImage: "url('/invite-bg-02.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <h3 className="text-2xl font-bold mb-4 mt-20 text-white growing-outline-text-2">Bonuses of Level</h3>
    <div className="w-full">
      <RewardsTable />
      <h3 className="text-2xl font-bold mb-4 mt-4 w-full text-center text-white growing-outline-text-2">List of your friends</h3>
      <FriendsList friends={friends} />
    </div>
  </div>
);

const RewardsTable = () => {
  const gradientTextStyle = {
    background: 'linear-gradient(to bottom, #FFBD00, #F6712E)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
  };

  const iconMap = {
    Rewards: 'rewards-icon.png',
    Friends: 'friend-icon.png',
    Gold: 'gold-coin.png',
    Diamond: 'diamond.png',
    Mush: 'mush-coin.png'
  };

  return (
    <div className="bg-gradient-to-b from-[#F4B94F] to-[#FF881A] rounded-xl shadow-md w-full px-4 pb-[3px]">
      <div className="w-full text-sm mb-4">
        <table className="w-full text-sm border-collapse">
          <thead style={{ backgroundColor: 'transparent' }}>
            <tr>
              {Object.entries(iconMap).map(([item, iconFile]) => (
                <th key={item} className="text-center px-2 py-2">
                  <div className="flex flex-col items-center">
                    <img
                      src={`${process.env.PUBLIC_URL}/${iconFile}`}
                      alt={item}
                      className="w-5 h-5 object-contain mb-1"
                    />
                    <span className="text-xs">{item}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white rounded-xl shadow-md">
            {rewardsData.map((reward, index) => (
              <tr key={index} className="p-2">
                <td className="pl-2 py-2 text-sm text-orange-800 font-['Arial',sans-serif] text-left">
                  {reward.level}
                </td>
                <td className="text-center" style={gradientTextStyle}>&gt;{reward.friends}</td>
                <td className="text-center" style={gradientTextStyle}>{reward.gold.toLocaleString()}</td>
                <td className="text-center" style={gradientTextStyle}>{reward.diamond.toLocaleString()}</td>
                <td className="text-center" style={gradientTextStyle}>{reward.mush.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const rewardsData = [
  { level: 'Lv1 Iron', friends: 10, gold: 50000, diamond: 10000, mush: 5000 },
  { level: 'Lv2 Bronze', friends: 30, gold: 100000, diamond: 20000, mush: 10000 },
  { level: 'Lv3 Silver', friends: 50, gold: 200000, diamond: 30000, mush: 15000 },
  { level: 'Lv4 Gold', friends: 80, gold: 300000, diamond: 40000, mush: 20000 },
  { level: 'Lv5 Diamond', friends: 100, gold: 400000, diamond: 50000, mush: 25000 },
  { level: 'Lv6 Brave', friends: 200, gold: 500000, diamond: 60000, mush: 30000 },
  { level: 'Lv7 Mentor', friends: 300, gold: 600000, diamond: 70000, mush: 40000 },
  { level: 'Lv8 Leader', friends: 500, gold: 700000, diamond: 80000, mush: 50000 },
  { level: 'Lv9 Jumbo', friends: 800, gold: 800000, diamond: 100000, mush: 60000 },
  { level: 'Lv10 King', friends: 1000, gold: 1000000, diamond: 200000, mush: 100000 },
];

const FriendsList = ({ friends }) => {
  const [showAllFriends, setShowAllFriends] = useState(false);
  const gradientTextStyle = {
    background: 'linear-gradient(to bottom, #FFBD00, #F6712E)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
  };

  const iconMapFriendList = {
    Time: 'time-icon.png',
    Friends: 'friend-icon.png',
    Pass: 'pass-icon.png',
    Bonus: 'mush-coin.png'
  };

  let displayedFriends = [];
  if (friends.length > 3) {
    displayedFriends = showAllFriends ? friends : friends.slice(0, 3);
  } else {
    displayedFriends = friends;
  }

  console.log(`[Tele_Invite][FriendsList] friends:`, friends);

  return (
    <div className="bg-gradient-to-b from-[#F4B94F] to-[#FF881A] rounded-xl shadow-md w-full px-4 pb-[3px]">
      <div className="grid grid-cols-4 items-center  py-2 ">
        {Object.entries(iconMapFriendList).map(([item, iconFile], index) => {
          let alignmentClass = " ml-2";
          let alignmentClassforLastIcon = " ";
          if (index === 1 || index === 2) {
            alignmentClass = "ml-2";
          } else if (index === 3) {
            alignmentClass = "mr-4 text-right items-end";
            alignmentClassforLastIcon = " mr-2";
          }

          return (
            <div key={item} className={`flex flex-col ${alignmentClass}`}>
              <img
                src={`${process.env.PUBLIC_URL}/${iconFile}`}
                alt={item}
                className={"w-5 h-5 object-contain mb-1 mt-2" + alignmentClassforLastIcon}
              />
              <span className="text-xs">{item}</span>
            </div>
          );
        })}
      </div>

      <div className="w-full text-sm bg-white rounded-xl mb-4">
        {displayedFriends.map((friend, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 items-center  py-2 px-2">
            <div className="text-left" style={gradientTextStyle}>{friend.time}</div>
            <div style={gradientTextStyle}>{friend.friends}</div>
            <div style={gradientTextStyle}>{friend.pass}</div>
            <div className="text-right" style={gradientTextStyle}>+{friend.bonus.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <button
        className="more-rank-button w-full py-3 px-4 text-base font-semibold text-[#49241B] text-center flex flex-col items-center justify-center"
        onClick={() => setShowAllFriends(!showAllFriends)}
      >
        <svg
          className={`ml-2 w-[22px] h-[14px] transition-transform duration-200 ${showAllFriends ? 'rotate-180' : ''}`}
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

              <stop stopColor="#F29904" />
              <stop stopColor="#EC9400" />
              <stop offset="1" stopColor="#FFDD72" />
            </linearGradient>
          </defs>
        </svg>

        {showAllFriends ? 'Show Less' : 'More Friend List'}
      </button>
    </div>
  );
};

const BottomNavigation = () => (
  <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-around py-2">
    {['Home', 'Rank', 'Invite', 'Task', 'Profile'].map((item) => (
      <button key={item} className="flex flex-col items-center">
        <div className="w-6 h-6 bg-gray-300 rounded-full mb-1"></div>
        <span className="text-xs">{item}</span>
      </button>
    ))}
  </div>
);

export default Tele_Invite;