'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import 'react-toastify/ReactToastify.css'
import { ToastContainer, ToastPosition, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

interface ResetPasswordPageParams {
  token: string;
  cedula: string;
}

const showMessage = (data: any) => {
  if (data.title === "Error") {
    toast.error(data.cuerpo, { position: 'top-right' as ToastPosition });
  } else {
    toast.success(data.cuerpo, { position: 'top-right' as ToastPosition });
  }
};

export default function ResetPasswordPage({ params }: { params: ResetPasswordPageParams }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState<boolean>(false); // Estado para mostrar/ocultar contraseña

  const verifyPasswords = () => {
    let password = document.getElementById('password1') as HTMLInputElement;
    let password1 = document.getElementById('password2') as HTMLInputElement;
    let submitButton = document.getElementById('submitButton') as HTMLButtonElement;

    if (password.value === password1.value && password.value.length > 5) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
      submitButton.onclick = handleSubmit;
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Alterna el estado de mostrar/ocultar contraseña
  };

  const handleSubmit = () => {
    let password1 = document.getElementById('password2') as HTMLInputElement;
    enviarNewPassword(password1.value);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/confirmresetpassword?numeroCedula=${params.cedula}&token=${params.token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setUser(data.usuario);
          showMessage({ title: 'Success', cuerpo: 'Token para recuperar contraseña correcto' });
        } else {
          showMessage({ title: 'Error', cuerpo: 'Datos para recuperar contraseña incorrectos' });
        }
      } else {
        showMessage({ title: 'Error', cuerpo: 'Datos para recuperar contraseña incorrectos' });
      }
    } catch (error) {
      showMessage({ title: 'Error', cuerpo: `Error en la solicitud: ${error instanceof Error ? error.message : String(error)}` });
    }
  };

  const enviarNewPassword = async (contracambiada: string) => {
    try {
      const response = await fetch(`/api/confirmresetpassword?numeroCedula=${params.cedula}&token=${params.token}&password=${contracambiada}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setUser(data.usuario);
          showMessage({ title: 'Éxito', cuerpo: 'Contraseña cambiada correctamente' });
        } else {
          showMessage({ title: 'Error', cuerpo: 'Datos para recuperar contraseña incorrectos' });
        }
      } else {
        showMessage({ title: 'Error', cuerpo: 'Datos para recuperar contraseña incorrectos' });
      }
    } catch (error) {
      showMessage({ title: 'Error', cuerpo: `Error en la solicitud: ${error instanceof Error ? error.message : String(error)}` });
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.token, params.cedula]);

  if (error) {
    return <div>Error: {error}</div>;
  } else if (user) {
    return (
      <div className='flex flex-col items-center justify-center'>
        <img
          src="https://sapiencia.gov.co/wp-content/uploads/2022/07/sapiencia-vertical-png.png"
          className='w-60 h-auto'
          alt="Flowbite Logo"
        />
        <div className="w-1/4">
          <div>
            <ToastContainer />
            <h1 className='text-slate-800 font-bold text-xl'>
              Cambiar contraseña
            </h1>

            <label htmlFor="password1" className='text-slate-800 mb-1 block text-sm'>Nueva contraseña:</label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'} // Cambia entre 'text' y 'password'
                className='p-2 rounded block mb-1 border border-gray-800 text-slate-800 w-full'
                id='password1'
                placeholder='Contraseña'
                required
                onChange={verifyPasswords}
              />
              <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 p-2 text-slate-800">
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <label htmlFor="password2" className='text-slate-800 mb-1 block text-sm'>Confirmar contraseña:</label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'} // Cambia entre 'text' y 'password'
                className='p-2 rounded block mb-1 border border-gray-800 text-slate-800 w-full'
                id='password2'
                placeholder='Confirmar Contraseña'
                required
                onChange={verifyPasswords}
              />
              <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 p-2 text-slate-800">
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <button id="submitButton" className='w-full text-white p-2 bg-fuchsia-800 rounded-lg mt-2' onClick={handleSubmit} disabled>
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
    )
  } else {
    return <div>Cargando...</div>;
  }
}
