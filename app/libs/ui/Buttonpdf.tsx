import React from 'react';

type ButtonpdfProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string; // Añadimos className como propiedad opcional
};

const Buttonpdf: React.FC<ButtonpdfProps> = ({ onClick, className }) => {
  return (
    <div className={`boton w-full flex mt-5 justify-center ${className}`}>
      <button 
        type="button" 
        className="focus:outline-none text-base text-center text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg px-2 py-2 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        onClick={onClick}
      >
        Generar Pdf
      </button>
    </div>
  );
};

export default Buttonpdf;
