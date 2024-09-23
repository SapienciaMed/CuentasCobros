'use client';
import { useForm } from 'react-hook-form';
import 'react-toastify/ReactToastify.css'
import { ToastContainer, ToastPosition, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';

function Loginpage() {
  const [recuperarContraseña, setRecuperarContraseña] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // Estado para mostrar/ocultar contraseña

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecuperarContraseña(event.target.checked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Alterna el estado de mostrar/ocultar contraseña
  };

  const { register, handleSubmit, formState: { errors } } = useForm();
  const showMessage = (data: any) => {
    if (data.title === "Error") {
      toast.error(data.cuerpo, { position: 'top-right' as ToastPosition });
    } else {
      toast.success(data.cuerpo, { position: 'top-right' as ToastPosition });
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        showMessage({ title: "Exito", cuerpo: 'Usuario logueado con éxito' });
        window.location.href = '/contratos';
      } else {
        const errorData = await response.json();
        showMessage({ title: "Error", cuerpo: `Error: ${errorData.error}` });
      }
    } catch (error) {
      showMessage({ title: "Error", cuerpo: 'Error al intentar loguearse: ' + error.message });
    }
  };

  const recuperarSubmit = async (data) => {
    try {
      const response = await fetch('/api/recuperarcontrasenia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const responseData = await response.json();
        showMessage({ title: "Éxito", cuerpo: `Se envió un correo a ${responseData.user.correoElectronico}` });
      } else {
        const errorData = await response.json();
        showMessage({ title: "Error", cuerpo: `Error al enviar el correo: ${errorData.error}` });
      }
    } catch (error) {
      showMessage({ title: "Error", cuerpo: 'No se encontró un usuario con esa cédula' });
    }
  };

  return (
    <div className='flex flex-col items-center justify-center mt-10'>
      <img
        src="https://sapiencia.gov.co/wp-content/uploads/2022/07/sapiencia-vertical-png.png"
        className='mb-4 w-60 h-auto'
        alt="Flowbite Logo"
      />
      {recuperarContraseña ? (
        <form onSubmit={handleSubmit(recuperarSubmit)} className='w-full max-w-xs mt-4'>
          <h1 className='text-slate-800 font-bold text-xl mb-2'>Recuperar Contraseña</h1>
          <label htmlFor="username" className='text-slate-800 mb-1 block text-sm'>Cédula:</label>
          <input
            type="text"
            {...register("cedula", {
              required: {
                value: true,
                message: 'La cédula es obligatoria'
              }
            })}
            className='p-2 rounded block mb-2 border border-gray-800 text-slate-800 w-full'
            placeholder='Cédula'
          />
          <button className='w-full text-white p-2 bg-fuchsia-800 rounded-lg mt-2'>
            Cambiar contraseña
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xs mt-4'>
          <h1 className='text-slate-800 font-bold text-xl mb-2'>Inicia sesión</h1>
          <hr className='mb-4 mt-4' />
          <label htmlFor="username" className='text-slate-800 mb-1 block text-sm'>Cédula:</label>
          <input
            type="text"
            {...register("cedula", {
              required: {
                value: true,
                message: 'La cédula es obligatoria'
              }
            })}
            className='p-2 rounded block mb-2 border border-gray-800 text-slate-800 w-full'
            placeholder='Cédula'
          />
          {errors.username && (
            <span className='text-red-500 text-xs'>{errors.username.message}</span>
          )}

          <label htmlFor="contraseña" className='text-slate-800 mb-1 block text-sm'>Contraseña:</label>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'} // Cambia entre 'text' y 'password'
              {...register("contraseña", {
                required: {
                  value: true,
                  message: 'La contraseña es obligatoria'
                }
              })}
              className='p-2 rounded block mb-2 border border-gray-800 text-slate-800 w-full'
              placeholder='Contraseña'
            />
            <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 p-2 text-slate-800">
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && (
            <span className='text-red-500 text-xs'>{errors.password.message}</span>
          )}
          <div className='flex space-x-4'>
            <button className='w-full text-white p-2 bg-fuchsia-800 rounded-lg mt-2'>
              Entrar
            </button>
            <a href="/register" className='w-full text-white text-center p-2 bg-fuchsia-800 rounded-lg mt-2'>
              Registrarme
            </a>
          </div>
        </form>
      )}

      <div className='flex mt-2 space-x-4'>
        <input type="checkbox" checked={recuperarContraseña} onChange={handleCheckboxChange} />
        <span>Recuperar Contraseña</span>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Loginpage;
