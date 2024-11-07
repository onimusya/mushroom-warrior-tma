import React, { useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';

import { UrlHashContext } from '../utils/Context';

// tgWebAppData=user%3D%257B%2522id%2522%253A335349823%252C%2522first_name%2522%253A%2522Francis%2522%252C%2522last_name%2522%253A%2522Hor%2522%252C%2522username%2522%253A%2522francishcw%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%257D%26chat_instance%3D302286515791966875%26chat_type%3Dsender%26auth_date%3D1721481650%26hash%3D93b53e25355c6b7e01a6aa0ce5ae9052148a79dec009616b82c73d576e5bb690&tgWebAppVersion=7.6&tgWebAppPlatform=tdesktop&tgWebAppThemeParams=%7B%22accent_text_color%22%3A%22%236ab2f2%22%2C%22bg_color%22%3A%22%2317212b%22%2C%22button_color%22%3A%22%235288c1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22destructive_text_color%22%3A%22%23ec3942%22%2C%22header_bg_color%22%3A%22%2317212b%22%2C%22hint_color%22%3A%22%23708499%22%2C%22link_color%22%3A%22%236ab3f3%22%2C%22secondary_bg_color%22%3A%22%23232e3c%22%2C%22section_bg_color%22%3A%22%2317212b%22%2C%22section_header_text_color%22%3A%22%236ab3f3%22%2C%22section_separator_color%22%3A%22%23111921%22%2C%22subtitle_text_color%22%3A%22%23708499%22%2C%22text_color%22%3A%22%23f5f5f5%22%7D

const Tele_Footer = () => {
  const location = useLocation();

  const urlHash = useContext(UrlHashContext);

  console.log(`[Tele_Footer] urlHash: `, urlHash);
  const playUrl = process.env.REACT_APP_GAME_URL + '#' + urlHash;
  console.log(`[Tele_Footer] playUrl: `, playUrl);

  const menuItems = [
    { icon: '/but_tribal_inactive.png', label: 'Tribal', path: '/tele_home' },
    { icon: '/but_play_inactive.png', label: 'Play', path: playUrl },
    { icon: '/but_invite_inactive.png', label: 'Invite', path: '/tele_invite' },
    { icon: '/but_earn_inactive.png', label: 'Earn', path: '/tele_earn' },
    { icon: '/but_rank_inactive.png', label: 'Rank', path: '/tele_rank' },
  ];

  return (
    <footer className="bg-[#FEB241] text-white py-2 fixed bottom-0 left-0 right-0 z-10">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mx-10">
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index} className="flex flex-col items-center">
              <img 
                src={location.pathname === item.path ? item.icon.replace('inactive', 'active') : item.icon} 
                alt={item.label} 
                className="w-12 h-12" 
              />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Tele_Footer;