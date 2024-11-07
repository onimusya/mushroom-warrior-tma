import React, { useState, useEffect } from 'react';
import Tele_Footer from '../components/Tele_Footer';
import TaskList from '../components/TaskList';
import "./Home.css";
import Tele_Header from '../components/Tele_Header';

import CryptoJS from 'crypto-js';
import axios from 'axios';
import { useInitData, useLaunchParams } from '@telegram-apps/sdk-react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { BeatLoader } from 'react-spinners';

import { TasksStatusContext, TasksListContext } from '../utils/Context';

function Tele_Earn() {
  const lp = useLaunchParams();
  const initData = useInitData();
  const [allRewards, setAllRewards] = useState(0);
  const [todayCheckIn, setTodayCheckIn] = useState(0);
  const [tasksComplete, setTasksComplete] = useState({1: [], 2: 0, 3: 0, 4: 0});
  const [dataLoading, setDataLoading] = useState(false);
  const [tasksList, setTasksList] = useState([]);
  const [taskGroups, setTaskGroups] = useState([]);

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

      console.log(`[Tele_Earn] params:`, params);
      console.log(`[Tele_Earn] key:`, key);
      console.log(`[Tele_Earn] iv:`, iv);

      let encrypted = CryptoJS.AES.encrypt(JSON.stringify(params), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();

      console.log(`[Tele_Earn] Encrypted Params:`, encrypted);

      // Call Api
      async function fetchData() {
        
        let lAllRewards = 0;
        let lTodayCheckIn = 0;
        let lTasksComplete = [];
        let lTasksList = [];
        let lTaskGroups = [];

        setDataLoading(true);
        console.log(`[Tele_Earn][fetchData] Get my account info...`);
        await axios.post(process.env.REACT_APP_API_URL + "invites/getAbout", {
          "data": encrypted 
        }).then(response => {
          console.log(`[Tele_Earn][api][getAbout] Response:`, response);

          let resp = response.data;
          console.log(`[Tele_Earn][api][getAbout] Resp:`, resp.data);
          lAllRewards = resp.data.allRewards.totalReward;          

        }).catch(error => {
          console.log(`[Tele_Earn][api][getAbout] Error:`, error);
        
        });  
        
        // get today check-in
        console.log(`[Tele_Earn][fetchData] Get today check-in...`);
        await axios.post(process.env.REACT_APP_API_URL + "invites/getTodayCheckIn", {
          "data": encrypted 
        }).then(response => {
          console.log(`[Tele_Earn][api][getTodayCheckIn] Response:`, response);

          let resp = response.data;
          lTodayCheckIn = resp.data;          

        }).catch(error => {
          console.log(`[Tele_Earn][api][getTodayCheckIn] Error:`, error);

        });

        // get task rewards mission completion
        console.log(`[Tele_Earn][fetchData] Get task reward...`);
        await axios.post(process.env.REACT_APP_API_URL + "invites/getTaskRewardGroupType", {
          "data": encrypted 
        }).then(response => {
          

          // 1: Daily Check In
          // 2: Join TG
          // 3: 
          // 4: Join X

          let resp = response.data;
          console.log(`[Tele_Earn][api][getTaskRewardGroupType] Resp:`, resp.data);
          lTasksComplete = resp.data;

        }).catch(error => {
          console.log(`[Tele_Earn][api][getTaskRewardGroupType] Error:`, error);

        });

        console.log(`[Tele_Earn][fetchData] Get list of tasks...`);
        await axios.post(process.env.REACT_APP_API_URL + "invites/getTaskManageListByEnable", {
          "data": encrypted 
        }).then(response => {
          
          // 1: Daily Check In
          // 2: Join TG
          // 3: 
          // 4: Join X

          let resp = response.data;
          console.log(`[Tele_Earn][api][getTaskManageListByEnable] Resp:`, resp.data);
          lTasksList = resp.data;

        }).catch(error => {
          console.log(`[Tele_Earn][api][getTaskManageListByEnable] Error:`, error);

        });

        console.log(`[Tele_Earn][fetchData] Get list of task groups...`);
        await axios.post(process.env.REACT_APP_API_URL + "invites/getManageTaskGroupList", {
          "data": encrypted 
        }).then(response => {
          
          let resp = response.data;
          console.log(`[Tele_Earn][api][getgetManageTaskGroupList] Resp:`, resp.data);
          lTaskGroups = resp.data;

        }).catch(error => {
          console.log(`[Tele_Earn][api][getgetManageTaskGroupList] Error:`, error);

        });

        console.log(`[Tele_Earn][api][getTaskRewardGroupType] lTodayCheckIn 2:`, lTodayCheckIn);
        setTodayCheckIn(lTodayCheckIn);
        setAllRewards(lAllRewards);
        setTasksComplete(lTasksComplete);
        setTasksList(lTasksList);
        
        console.log(`[Tele_Earn][api] lTaskGroups:`, lTaskGroups);
        setTaskGroups(lTaskGroups);

        setDataLoading(false);

      }

      if (lp.platform == "ios") {
        console.log(`[Tele_Earn] Delay 5s for ios to fetch data...`);
        setDataLoading(true);
        setTimeout(fetchData, 2000);
      } else {
        fetchData();
      }
      
    }

  }, []);

  
  return (
    <TasksListContext.Provider value={tasksList}>
    <TasksStatusContext.Provider value={tasksComplete} >
    
    <div className="flex flex-col w-full bg-[#0D0D0D] items-center justify-center">
      <div className='w-full max-w-[800px] color-[#FFA500]'>
        <Tele_Header />
        <RewardsHeader allRewards={allRewards} dataLoading={dataLoading} />
        <TaskList todayCheckIn={todayCheckIn} taskGroups={taskGroups} />
        <RewardsFooter />
        <Tele_Footer />
      </div>
    </div>

    </TasksStatusContext.Provider>
    </TasksListContext.Provider>
  );
}

const RewardsHeader = ({ allRewards, dataLoading }) => {
  return (
    <div className="min-h-[300px] w-full flex flex-col items-center justify-end bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/earn-bg-1.png')" }}>
      <div className="flex flex-col items-center justify-center  w-full max-w-[350px] mb-8">
        <div className=" py-2 px-4 flex flex-row items-center bg-contain bg-center bg-no-repeat justify-center  mb-1 h-[100px] w-full" style={{ backgroundImage: "url('/earn-button-bg.png')" }}>
          <img src="/mush-coin.png" alt="Coin" className="w-12 h-12 ml-5 mr-3" />
          <div className='flex flex-col'>
          {
            dataLoading ? (
              <BeatLoader color="#c14e0b" loading={dataLoading} aria-label='Loading' />
            ) : (
              <span className="text-white font-bold text-2xl">{allRewards.toLocaleString('en-US')}</span>
            )
          }
          
          <span className="text-white text-sm">Earn Rewards 💎</span>
          </div>
        
        </div>
        <div className="  px-4 text-center">
          <span className="text-white font-semibold text-2xl">Earn more coins</span>
        </div>
      </div>
    </div>
  );
};

const RewardsFooter = () => {
  return (
    <div className="-mt-4 min-h-[200px] w-full flex flex-col items-center justify-end bg-cover bg-center bg-no-repeat " style={{ backgroundImage: "url('/earn-bg-2.png')" }}>
      
    </div>
  );
};



export default Tele_Earn;