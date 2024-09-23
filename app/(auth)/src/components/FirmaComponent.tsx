import React, { useState, useRef } from 'react';

const FirmaComponent = () => {
  const [firmaUrl, setFirmaUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFirmaUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (fileInputRef.current) {
      e.currentTarget.classList.remove("border", "border-gray-300");
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <input
        type="file"
        id="FirmaUsuario"
        onChange={handleFileChange}
        className='hidden'
        ref={fileInputRef}
      />
      <div
        className="ml-2 w-[220px] h-[40px] border border-gray-300 cursor-pointer"
        style={{
          backgroundImage: `url(${firmaUrl})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
        onClick={handleDivClick}
      >
        {firmaUrl ? null : <p className="text-center text-gray-500">Click para subir la firma</p>}
      </div>
    </div>
  );
};

export default FirmaComponent;