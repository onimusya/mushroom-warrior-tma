import React, { useContext } from 'react';

const TaskItem = ({ icon, name, text, reward, status, url, onClick }) => {
  console.log(`[TaskItem] ${name} status:`, status);
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-3 mb-2 flex items-center justify-between cursor-pointer" 
      onClick={onClick}
    >
      <div className="flex flex-row items-center">
        <img src={`/icons/${icon}.png`} alt={icon} className="w-12 h-12 mr-3" />
        <div>
          <span className="font-medium text-[#774600] ">{text}</span>
          <div className='flex items-center flex-row'>
            <img src="/mush-coin.png" alt="coin" className="w-4 h-4 mr-1" />
            <span className="text-yellow-500 font-medium mr-2">{reward}</span>
          </div>
        </div>
      </div>
      {
        status ? (
          <div className="flex items-center">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-base">✓
              
            </span>
          </div>
          </div>
  
        ) : (
          <div className="flex items-center">
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-white text-xl">
            ➡️
            </span>
          </div>
          </div>
          
        )
      }
    </div>
  );
};

export default TaskItem;