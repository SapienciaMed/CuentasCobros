"use client";
import React from 'react';

type ButtonpdfProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const Buttonpdf: React.FC<ButtonpdfProps> = ({ onClick }) => {
  return (
    <div className='boton w-full flex mt-5 justify-center'>
      <button 
        type="button" 
        className="focus:outline-none text-2xl text-center text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-10 py-5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        onClick={onClick}
      >
        Generar Pdf
      </button>
    </div>
  );
};

export default Buttonpdf;






