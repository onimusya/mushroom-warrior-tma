import React, { useState, useEffect, useContext, useReducer } from 'react';
import { useInitData, useUtils } from '@telegram-apps/sdk-react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { BeatLoader } from 'react-spinners';

import TaskItem from './TaskItem';
import TaskItemNew from './TaskItemNew';

import Modal from './Modal';

import { TasksStatusContext } from '../utils/Context';
import { TasksListContext } from '../utils/Context';

const TaskList = ({ todayCheckIn, taskGroups }) => {
  const utils = useUtils();
  const initData = useInitData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [dailyCheckInList, setDailyCheckInList] = useState([]);
  const [dailyCheckInStart, setDailyCheckInStart] = useState(1);
  const [allowDailyClaim, setAllowDailyClaim] = useState(0);
  const [dailyClaiming, setDailyClaiming] = useState(false);
  const [dailyClaimed, setDailyClaimed] = useState(0);

  const [telegramJoining, setTelegramJoining] = useState(false);
  const [allowTelegramClaim, setAllowTelegramClaim] = useState(0);
  const [telegramClaiming, setTelegramClaiming] = useState(false);
  const [telegramClaimed, setTelegramClaimed] = useState(0);

  const [twitterJoining, setTwitterJoining] = useState(false);
  const [allowTwitterClaim, setAllowTwitterClaim] = useState(0);
  const [twitterClaiming, setTwitterClaiming] = useState(false);
  const [twitterClaimed, setTwitterClaimed] = useState(0);

  const [tasksStatus, setTasksStatus] = useState([0, 0, 0]);
  const [tasksListStatusIndex, setTasksListStatusIndex] = useState(0);
  const [tasksListStatus, setTasksListStatus] = useState({});

  const tasksComplete = useContext(TasksStatusContext);
  const tasksList = useContext(TasksListContext);

  const [allTasks, dispatchTasks] = useReducer(tasksReducer, []);

  let tasks = [
    { icon: 'FaDaily', name: 'daily', text: 'Daily reward', reward: '+500 per day', url: ""},
    //{ icon: 'FaTelegramPlane', name: 'telegram', text: 'Join our Telegram', reward: '+10,000', url: "https://t.me/notmushcoin" },
    //{ icon: 'FaTwitter', name: 'x', text: 'Join our X (Twitter)', reward: '+10,000', url: "https://x.com/notmushcoin" },
    //{ icon: 'FaDiscord', text: 'Join our Discord', reward: '+6,649,000', status: 0, url: "" },
    //{ icon: 'FaYoutube', text: 'Join our Youtube', reward: '+6,649,000', status: 0, url: "" },
    //{ icon: 'FaTiktok', text: 'Join our Tiktok', reward: '+6,649,000', status: 0, url: "" }
  ];
  console.log(`[TaskList] Static tasks:`, tasks);
  console.log(`[TaskList] Dynamic tasks:`, tasksList);
  console.log(`[TaskList] tasksComplete:`, tasksComplete);
  console.log(`[TaskList] taskGroups:`, taskGroups);


  //tasksStatus[1] = tasksComplete[4];
  //tasksStatus[2] = tasksComplete[2];
  //setTasksStatus(tasksStatus);

  useEffect(() => {

    if (tasksList.length > 0) {

      let i = 0;
      let lAllTasks = [];
      for (i=0; i<tasksList.length; i++) {
        lAllTasks.push(tasksList[i]);
        lAllTasks[i].status = tasksComplete[tasksList[i].taskType];
      }

      dispatchTasks({
        type: 'sync',
        tasks: lAllTasks
      });

      console.log(`[TaskList] Tasks List Status Index:`, tasksList[0].taskType);        
      setTasksListStatusIndex(tasksList[0].taskType);      


      let tls = Object.assign({}, tasksComplete);
      console.log(`[TaskList] tls:`, tls);  
      setTasksListStatus(tls);
    }

    console.log(`[TaskList] Update tasks status...`);
    let tt = [];
    tt[0] = todayCheckIn;
    tt[1] = tasksComplete[4];
    tt[2] = tasksComplete[2];
    setTasksStatus(tt);

    setDailyClaimed(todayCheckIn);
    setTelegramClaimed(tasksComplete[4]);
    setTwitterClaimed(tasksComplete[2]);
    
    let dd = [];
    /*
    if (tasksComplete[1].length < 8) {
      let rr = 8 - tasksComplete[1].length;
      let ee = Array(rr).fill(0);
      dd = dd.concat(tasksComplete[1], ee);
    } else {
      dd = tasksComplete[1];
    }
    */

    //tasksComplete[1] = tasksComplete[1].concat([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);

    //console.log(`[TasList] tasksComplete Length:`, tasksComplete[1].length);

    if (tasksComplete[1].length > 27) {
      dd = tasksComplete[1].slice(-27);

      // If today not yet check in
      if (!todayCheckIn) {
        dd.push(0);
      }
      
      setDailyCheckInStart(tasksComplete[1].length-11);
      //console.log(`[TasList] dd 1 Length:`, dd.length);
    } else {
      dd = dd.concat(tasksComplete[1]);

      // If today not yet check in
      if (!todayCheckIn) {
        dd.push(0);
      }

      setDailyCheckInStart(1);
      //console.log(`[TasList] dd 2 Length:`, dd.length);
    }

    console.log(`[TaskList] Daily checkin list:`, dd);
    setDailyCheckInList(dd);

  }, [tasksComplete]);

  const handleTaskClick = (task) => {

    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleDailyClaimClick = () => {
    console.log(`[TaskList][handleDailyClaimClick]`);

    // Call api to update complete Twitter tasks
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
        "taskType": 1 // Daily check in
      }

      console.log(`[TaskList] params:`, params);

      // encrypt params
      const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_API_KEY);
      const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_API_IV);

      console.log(`[TaskList] key`, key);
      console.log(`[TaskList] iv`, iv);

      let encrypted = CryptoJS.AES.encrypt(JSON.stringify(params), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();

      console.log(`[TaskList] Encrypted Params:`, encrypted);

      // Call Api
      async function fetchData() {
        // get my account info
        console.log(`[TaskList][fetchData] Telegram task...`);
        setDailyClaiming(true);

        await axios.post(process.env.REACT_APP_API_URL + "invites/dailyCheckInReward", {
          "data": encrypted 
        }).then(response => {
          console.log(`[TaskList][api][dailyCheckInReward] Response:`, response);
          let resp = response.data;

          setDailyClaiming(false);
          setDailyClaimed(1);
      
          let tt = tasksStatus.slice();
          tt[0] = 1;
          setTasksStatus(tt);
          
          let dd = dailyCheckInList.slice();
          dd[dd.length-1] = 1;
          setDailyCheckInList(dd);

        }).catch(error => {
          console.log(`[TaskList][api][dailyCheckInReward] Error:`, error);

        });

      }

      fetchData();
    }
  }

  const handleTelegramTaskClick = (url) => {
    console.log(`[TaskList][handleTelegramTaskClick] url:`, url);
    //window.open(url, "_blank");
    utils.openTelegramLink(url);
    setTelegramJoining(true);

    setTimeout(() => {      
      setAllowTelegramClaim(1);
      setTelegramJoining(false);
    }, 5000)
    
  }

  const handleTelegramClaimClick = () => {
    console.log(`[TaskList][handleTelegramClaimClick]`);

    // Call api to update complete Twitter tasks
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
        "taskType": 2 // Telegram
      }

      console.log(`[TaskList] params:`, params);

      // encrypt params
      const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_API_KEY);
      const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_API_IV);

      console.log(`[TaskList] key`, key);
      console.log(`[TaskList] iv`, iv);

      let encrypted = CryptoJS.AES.encrypt(JSON.stringify(params), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();

      console.log(`[TaskList] Encrypted Params:`, encrypted);

      // Call Api
      async function fetchData() {
        // get my account info
        console.log(`[TaskList][fetchData] Telegram task...`);
        setTelegramClaiming(true);

        await axios.post(process.env.REACT_APP_API_URL + "invites/dailyCheckInReward", {
          "data": encrypted 
        }).then(response => {
          console.log(`[TaskList][api][dailyCheckInReward] Response:`, response);

          let resp = response.data;

          setTelegramClaiming(false);
          setTelegramClaimed(1);
      
          let tt = tasksStatus.slice();
          tt[1] = 1;
          setTasksStatus(tt);

        }).catch(error => {
          console.log(`[TaskList][api][dailyCheckInReward] Error:`, error);

        });

      }

      fetchData();
    }

  }

  const handleTwitterTaskClick = (url) => {
    console.log(`[TaskList][handleTwitterTaskClick] url:`, url);
    //window.open(url, "_blank");
    utils.openLink(url);
    setTwitterJoining(true);

    setTimeout(() => {
      setAllowTwitterClaim(1);
      setTwitterJoining(false);
    }, 5000)
    
  }

  const handleTwitterClaimClick = () => {
    console.log(`[TaskList][handleTwitterClaimClick]`);

    // Call api to update complete Twitter tasks
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
        "taskType": 4
      }

      console.log(`[TaskList] params:`, params);

      // encrypt params
      const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_API_KEY);
      const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_API_IV);

      console.log(`[TaskList] key`, key);
      console.log(`[TaskList] iv`, iv);

      let encrypted = CryptoJS.AES.encrypt(JSON.stringify(params), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();

      console.log(`[TaskList] Encrypted Params:`, encrypted);

      // Call Api
      async function fetchData() {
        // get my account info
        console.log(`[TaskList][fetchData] Twitter task...`);
        setTwitterClaiming(true);
        await axios.post(process.env.REACT_APP_API_URL + "invites/dailyCheckInReward", {
          "data": encrypted 
        }).then(response => {
          console.log(`[TaskList][api][dailyCheckInReward] Response:`, response);

          let resp = response.data;
          setTwitterClaiming(false);
          setTwitterClaimed(1);
          let tt = tasksStatus.slice();
          tt[2] = 1;
          setTasksStatus(tt);
      
        }).catch(error => {
          console.log(`[TaskList][api][dailyCheckInReward] Error:`, error);

        });

      }

      fetchData();
    }    
  }

  const handleTaskListClick = (task, index) => {
    console.log(`[TaskList][handleTaskListClick] task[${index}]:`, task);
    utils.openLink(task.taskUrl);

    if (task.status == 1) {
      console.log(`[TaskList][handleTaskListClick][timeout] Task Type ${task.taskType} already completed.`);
      return;
    }

    task.status = 9;
    dispatchTasks({
      type: 'update_status',
      task: task
    });

    setTimeout((t) => {      
      t.status = 1;
      console.log(`[TaskList][handleTaskListClick][timeout] Task Type ${t.taskType} status:`, t.status);
      dispatchTasks({
        type: 'update_status',
        task: t
      });
    }, 5000, task);

    // Call api to update
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
        "taskType": task.taskType
      }

      console.log(`[TaskList][handleTaskListClick] params:`, params);

      // encrypt params
      const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_API_KEY);
      const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_API_IV);

      let encrypted = CryptoJS.AES.encrypt(JSON.stringify(params), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();

      console.log(`[TaskList][handleTaskListClick] Encrypted Params:`, encrypted);

      // Call Api
      async function fetchData() {
        // get my account info
        console.log(`[TaskList][handleTaskListClick][fetchData] Update Task Type ${task.taskType}`);

        await axios.post(process.env.REACT_APP_API_URL + "invites/dailyCheckInReward", {
          "data": encrypted 
        }).then(response => {
          console.log(`[TaskList][handleTaskListClick][fetchData][api[dailyCheckInReward] Response:`, response);

          let resp = response.data;

        }).catch(error => {
          console.log(`[TaskList][handleTaskListClick][fetchData][api][dailyCheckInReward] Error:`, error);

        });

      }

      fetchData();
    }

  }

  const renderModalContent = () => {
  
    if (!selectedTask) return null;

    switch (selectedTask.text) {
      case 'Daily reward':
        return (

          <div className="bg-white p-4 rounded-lg shadow-lg relative w-96">

            <div className="text-center">
              <img src="/icons/FaDaily.png" width="50" alt="Calendar" className="mx-auto mb-4" />
              <h2 className="text-orange-500 text-lg font-bold">Daily reward</h2>
              <p className="text-gray-600 mt-2 text-base">Accrue coins for logging into the game daily without skipping</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4 daily-reward-max-h overflow-y-auto">
              {dailyCheckInList.map((data, i) => (
                <div key={i} className={`p-2 rounded-lg ${data !== 0 ? 'bg-yellow-500' : 'bg-gray-200'} text-center`}>
                  <span className="block text-sm">Day {i + dailyCheckInStart}</span>
                  { data === 0 ? 
                    ( <img src="/mush-coin.png" alt="Coin" className="w-4 h-4 mx-auto my-1" />) :
                    ( <span className=''>✅</span> )
                  }                  
                  <span className="block font-bold text-xl">500</span>
                </div>
              ))}
            </div>

            {
              dailyClaimed ? (
                <div className="w-full bg-brown-600 text-black font-bold py-2 rounded-lg mt-2 flex items-center justify-center">
                  <div className="mr-2 ">Claimed</div>
                </div>
              ) : (
                <>
                {
                  dailyClaiming ? (
                    <div className="w-full bg-brown-600 text-black font-bold py-2 rounded-lg mt-2 flex items-center justify-center">
                      <BeatLoader color="#c14e0b" loading={dailyClaiming} aria-label='Loading' />
                    </div>                      
                  ) : (
                    <button onClick={ (e) => { e.preventDefault(); handleDailyClaimClick(); }} className="w-full bg-brown-600 text-white font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
                      <img src="/claim.png" alt="Claim" className="mr-2 " />
                    </button>  
                  )
                }
                </>
              )
            }
          </div>

        );
      case 'Join our Telegram':
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg relative w-80">
            <div className="text-center">
              <img src="/icons/FaTelegramPlane.png" alt="Telegram" className="mx-auto mb-4 w-16 h-16 p-2" />
              <h2 className="text-orange-500 text-xl font-bold">Join our Telegram</h2>
            </div>

            {
              telegramJoining ? (
                <div className="w-full bg-brown-600 text-black font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
                  <BeatLoader color="#c14e0b" loading={telegramJoining} aria-label='Loading' />
                </div>
              ) : (
                <button onClick={ (e) => { e.preventDefault(); handleTelegramTaskClick(selectedTask.url); }} target="_blank" className="w-full bg-brown-600 text-white font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
                  <img src="/join.png" alt="Join" className="mr-2 " />
                </button>

              )
            }

            <div className="flex items-center justify-center mt-4">
              <img src="/mush-coin.png" alt="Coin" className="mr-2 w-6 h-6" />
              <span className="text-yellow-500 font-bold text-xl">+10,000</span>
            </div>

            {
              telegramClaimed ? (
                <div className="w-full bg-brown-600 text-black font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
                  <div className="mr-2 ">Claimed</div>
                </div>

              ) : allowTelegramClaim ? (
                <>
                  {
                    telegramClaiming ? (
                      <div className="w-full bg-brown-600 text-black font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
                        <BeatLoader color="#c14e0b" loading={telegramClaiming} aria-label='Loading' />
                      </div>                      
                    ) : (
                      <button onClick={ (e) => { e.preventDefault(); handleTelegramClaimClick(); }} className="w-full bg-brown-600 text-white font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
                        <img src="/claim.png" alt="Claim" className="mr-2 " />
                      </button>
                    )
                  }
                </>
                ) : (
                  <div className="w-full bg-brown-600 text-black font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
                    <div className="mr-2 ">Pending</div>                    
                  </div>
                )
            }

          </div>
        );

      case 'Join our X (Twitter)':
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg relative w-80">
          <div className="text-center">
            <img src="/icons/FaTwitter.png" alt="Telegram" className="mx-auto mb-4 w-16 h-16 p-2" />
            <h2 className="text-orange-500 text-xl font-bold">Join our X (Twitter)</h2>
          </div>

          {
            twitterJoining ? (
              <div className="w-full bg-brown-600 text-black font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
                <BeatLoader color="#c14e0b" loading={twitterJoining} aria-label='Loading' />
              </div>
  
            ) : (
              <button onClick={ (e) => { e.preventDefault(); handleTwitterTaskClick(selectedTask.url); }} className="w-full bg-brown-600 text-white font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
                <img src="/join.png" alt="Join" className="mr-2 " />
              </button>
            )
          }

          <div className="flex items-center justify-center mt-4">
            <img src="/mush-coin.png" alt="Coin" className="mr-2 w-6 h-6" />
            <span className="text-yellow-500 font-bold text-xl">+10,,000</span>
          </div>

          {
            twitterClaimed ? (
              <div className="w-full bg-brown-600 text-black font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
                <div className="mr-2 ">Claimed</div>
              </div>

            ) : allowTwitterClaim ? (
              <>
                {
                  twitterClaiming ? (
                    <div className="w-full bg-brown-600 text-black font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
                      <BeatLoader color="#c14e0b" loading={twitterClaiming} aria-label='Loading' />
                    </div>                      
                  ) : (
                    <button onClick={ (e) => { e.preventDefault(); handleTwitterClaimClick(); }} className="w-full bg-brown-600 text-white font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
                      <img src="/claim.png" alt="Claim" className="mr-2 " />
                    </button>
                  )
                }
              </>

              ) : (
                <div className="w-full bg-brown-600 text-black font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
                  <div className="mr-2 ">Pending</div>
                </div>
  
              )
          }        

          </div>
        );
      case 'Join our Discord':
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg relative w-80">
          <div className="text-center">
            <img src="/icons/FaDiscord.png" alt="Telegram" className="mx-auto mb-4 w-16 h-16 p-2" />
            <h2 className="text-orange-500 text-xl font-bold">Join our Discord</h2>
          </div>

          <button className="w-full bg-brown-600 text-white font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
            <img src="/join.png" alt="Join" className="mr-2 " />

          </button>

          <div className="flex items-center justify-center mt-4">
            <img src="/mush-coin.png" alt="Coin" className="mr-2 w-6 h-6" />
            <span className="text-yellow-500 font-bold text-xl">+6,549,000</span>
          </div>

          <button className="w-full bg-brown-600 text-white font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
            <img src="/claim.png" alt="Claim" className="mr-2 " />

          </button>
        </div>
        );
      case 'Join our Youtube':
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg relative w-80">
          <div className="text-center">
            <img src="/icons/FaYoutube.png" alt="Telegram" className="mx-auto mb-4 w-16 h-16 p-2" />
            <h2 className="text-orange-500 text-xl font-bold">Join our Youtube</h2>
          </div>

          <button className="w-full bg-brown-600 text-white font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
            <img src="/join.png" alt="Join" className="mr-2 " />

          </button>

          <div className="flex items-center justify-center mt-4">
            <img src="/mush-coin.png" alt="Coin" className="mr-2 w-6 h-6" />
            <span className="text-yellow-500 font-bold text-xl">+6,549,000</span>
          </div>

          <button className="w-full bg-brown-600 text-white font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
            <img src="/claim.png" alt="Claim" className="mr-2 " />

          </button>
        </div>
        );
      case 'Join our Tiktok':
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg relative w-80">
          <div className="text-center">
            <img src="/icons/FaTiktok.png" alt="Telegram" className="mx-auto mb-4 w-16 h-16 p-2" />
            <h2 className="text-orange-500 text-xl font-bold">Join our Tiktok</h2>
          </div>

          <button className="w-full bg-brown-600 text-white font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
            <img src="/join.png" alt="Join" className="mr-2 " />

          </button>

          <div className="flex items-center justify-center mt-4">
            <img src="/mush-coin.png" alt="Coin" className="mr-2 w-6 h-6" />
            <span className="text-yellow-500 font-bold text-xl">+6,549,000</span>
          </div>

          <button className="w-full bg-brown-600 text-white font-bold py-2 rounded-lg mt-4 flex items-center justify-center">
            <img src="/claim.png" alt="Claim" className="mr-2 " />

          </button>
        </div>
        );
      default:
        return (
          <div>
            <h3 className="text-xl text-orange-500 font-bold">{selectedTask.text}</h3>
            <p className="text-lg text-orange-500">{selectedTask.reward}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-100 p-4 rounded-lg radius-3xl pb-6 shadow-md min-h-[600px] z-10">

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-orange-500">DAILY TASKS</h2>
      </div>

      {tasks.map((task, index) => (
        <TaskItem key={index} {...task} status={tasksStatus[index]} onClick={(e) => { e.preventDefault(); handleTaskClick(task); }} />
      ))}

      {
        taskGroups.map((group, index) => 
          (
            <>
            <div key={index} className="flex justify-between items-center mt-8 mb-8">
              <h2 className="text-2xl font-bold text-orange-500">{group}</h2>
            </div>

            {
              allTasks.map((task, index) => (
                <>
                {
                  task.taskGroup == group ? (
                    <TaskItemNew key={index} {...task} onClick={(e) => { e.preventDefault(); handleTaskListClick(task, index); }} />
                  ) : (<></>)
                }
                </>                
              ))
            }
            </>
          )
        )
      }

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'sync': {      
      console.log(`[TaskList][tasksReducer][sync] Tasks:`, action.tasks);
      return action.tasks
    }

    case 'update_status': {
      return tasks.map(t => {
        if (t.taskType === action.task.taskType) {
          console.log(`[TaskList][tasksReducer][update_status] Task:`, action.task);
          return action.task
        } else {
          console.log(`[TaskList][tasksReducer][update_status] Not found task.`);
          return t;
        }
      });
    }

    default: {
      throw Error(`[TaskList][tasksReducer] Unknown action:` + action.type);
    }
  }
}
export default TaskList;