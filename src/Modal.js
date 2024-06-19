import React from 'react';

const Modal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-500 hover:text-gray-700 focus:outline-none">
          X
        </button>
        <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
        <p>Your registration was successful. You will be notified through mail once your network is created.</p>
      </div>
    </div>
  );
};

export default Modal;
