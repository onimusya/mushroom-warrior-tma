import React from 'react';
import { FaTelegram, FaDiscord, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const DailyTasks = () => {
  const tasks = [
    { icon: '📅', text: 'Daily reward', coins: '6,048,000' },
    { icon: <FaTelegram />, text: 'Join our Telegram', coins: '6,048,000' },
    { icon: <FaXTwitter />, text: 'Join our X (Twitter)', coins: '6,048,000' },
    { icon: <FaDiscord />, text: 'Join our Discord', coins: '6,048,000' },
    { icon: <FaYoutube />, text: 'Join our Youtube', coins: '6,048,000' },
    { icon: <FaTiktok />, text: 'Join our Tiktok', coins: '6,048,000' },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto h-screen bg-teal-200 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('/path-to-your-mushroom-background.jpg')"}}></div>
      
      {/* Content */}
      <div className="relative z-10 pt-12 px-4">
        {/* Total Rewards */}
        <div className="bg-orange-400 rounded-full py-2 px-4 flex items-center justify-between mb-6">
          <img src="/path-to-coin-icon.png" alt="Coin" className="w-8 h-8" />
          <span className="text-white font-bold text-xl">888888</span>
          <span className="text-white text-sm">Total Rewards</span>
        </div>

        {/* Earn more coins */}
        <h2 className="text-white text-xl font-bold mb-4">Earn more coins</h2>

        {/* Daily tasks */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Daily tasks</h3>
            <button className="text-red-500">×</button>
          </div>
          
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{typeof task.icon === 'string' ? task.icon : React.cloneElement(task.icon, { className: 'text-2xl' })}</span>
                <span>{task.text}</span>
              </div>
              <div className="flex items-center">
                <img src="/path-to-small-coin-icon.png" alt="Coin" className="w-4 h-4 mr-1" />
                <span className="text-sm text-gray-600 mr-2">{task.coins}</span>
                <span className="text-green-500">✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyTasks;