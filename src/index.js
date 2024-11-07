// import React from 'react';

import ReactDOM from 'react-dom/client';
import { Root } from './Root';
// import './mockEnv.js';

//import { BrowserRouter } from 'react-router-dom';

import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.css';
import './styles/tailwind.css';


let hash = window.location.hash.slice(1);
console.log(`[Index] hash:`, hash);
console.log(`[Index] location:`, window.location.toString());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Root />
);

/*
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>    
  </React.StrictMode>
);
*/


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
