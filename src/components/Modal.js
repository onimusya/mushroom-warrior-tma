import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 w-8 h-8 bg-contain bg-center bg-no-repeat focus:outline-none"
        style={{ backgroundImage: "url('/cancel.png')" }}
        aria-label="Close"
      />
      {children}
      </div>
    </div>
  );
};

export default Modal;