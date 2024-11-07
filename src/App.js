import React from 'react';
import { Route, Routes, BrowserRouter as Router, useSearchParams } from 'react-router-dom';
import {
  useInitData, useCloudStorage
} from '@telegram-apps/sdk-react';

import { AppRoot } from '@telegram-apps/telegram-ui';
import { UrlHashContext, TonConnectUiContext } from './utils/Context';

import Home from './Pages/Home';
import Tele_Game from './Pages/Tele-Game';
import Tele_Home from './Pages/Tele-Home';
import Tele_Rank from './Pages/Tele-Rank';
import Tele_Earn from './Pages/Tele-Earn';
import Tele_Invite from './Pages/Tele-Invite';

import { TonConnectUI } from '@tonconnect/ui';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, WalletContractV4, internal } from "@ton/ton";

function App() {

  const initData = useInitData();

  //console.log(`[App] key: ${process.env.REACT_APP_API_KEY}`);
  //console.log(`[App] iv: ${process.env.REACT_APP_API_IV}`);
  console.log(`[App] game url: ${process.env.REACT_APP_GAME_URL}`);
  console.log(`[App] public url: ${process.env.PUBLIC_URL}`);
  
  console.log(`[App] initData: `, initData);

  const hash = window.location.hash.slice(1);
  console.log(`[App] hash: `, hash);

  return (
    <AppRoot>
      <UrlHashContext.Provider value={hash}>
      <Routes>
        <Route path="/" element={<Tele_Home />} />
        <Route path="/tele_home" element={<Tele_Home />} />
        <Route path="/tele_rank" element={<Tele_Rank />} />
        <Route path="/tele_earn" element={<Tele_Earn />} />
        <Route path="/tele_invite" element={<Tele_Invite />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Tele_Home />} />
      </Routes>
      </UrlHashContext.Provider>
    </AppRoot>
  );
}

export default App;
