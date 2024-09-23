'use client';
import { useForm } from 'react-hook-form';
import 'react-toastify/ReactToastify.css';
import { ToastContainer, ToastPosition, toast } from 'react-toastify';
import React, { useState } from 'react';

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const password = watch("contraseña");
  
  const [showPassword, setShowPassword] = useState<boolean>(false); // Estado para mostrar/ocultar contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); // Estado para confirmar contraseña

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const showMessage = (data: any) => {
    if (data.title === "Error") {
      toast.error(data.cuerpo, { position: 'top-right' as ToastPosition });
    } else {
      toast.success(data.cuerpo, { position: 'top-right' as ToastPosition });
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        showMessage({ title: 'Error', cuerpo: 'Error al crear el usuario' });
      }

      const result = await response.json();
      showMessage({ title: 'Éxito', cuerpo: 'Usuario creado con éxito' });
      reset();
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Error al crear el usuario:', error.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <img
        src="https://sapiencia.gov.co/wp-content/uploads/2022/07/sapiencia-vertical-png.png"
        className='w-60 h-auto'
        alt="Flowbite Logo"
      />
      <div className="w-1/4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className='text-slate-800 font-bold text-xl'>
            Registro
          </h1>

          {/* Nombre Completo */}
          <label htmlFor="nombre_completo" className='text-slate-800 mb-1 block text-sm'>Nombre:</label>
          <input
            type="text"
            {...register("nombre_completo", {
              required: 'El nombre completo es obligatorio'
            })}
            className='p-2 rounded block mb-1 border border-gray-800 text-slate-800 w-full'
            placeholder='Nombre Completo'
          />
          {errors.nombre_completo && (
            <span className='text-red-500 text-xs'>{errors.nombre_completo.message}</span>
          )}

          {/* Cedula */}
          <label htmlFor="cedula" className='text-slate-800 mb-1 block text-sm'>Cédula:</label>
          <input
            type="text"
            {...register("cedula", {
              required: 'Digita tu cédula'
            })}
            className='p-2 rounded block mb-1 border border-gray-800 text-slate-800 w-full'
            placeholder='Digita tu número de CC'
          />
          {errors.cedula && (
            <span className='text-red-500 text-xs'>{errors.cedula.message}</span>
          )}

          {/* Contraseña */}
          <label htmlFor="contraseña" className='text-slate-800 mb-1 block text-sm'>Contraseña:</label>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register("contraseña", {
                required: 'La contraseña es obligatoria'
              })}
              className='p-2 rounded block mb-1 border border-gray-800 text-slate-800 w-full'
              placeholder='Contraseña'
            />
            <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 p-2 text-slate-800">
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.contraseña && (
            <span className='text-red-500 text-xs'>{errors.contraseña.message}</span>
          )}

          {/* Confirmar Contraseña */}
          <label htmlFor="confirmPassword" className='text-slate-800 mb-1 block text-sm'>Confirmar contraseña:</label>
          <div className='relative'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register("confirmPassword", {
                required: 'Confirma tu contraseña'
              })}
              className='p-2 rounded block mb-1 border border-gray-800 text-slate-800 w-full'
              placeholder='Confirmar Contraseña'
            />
            <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute inset-y-0 right-0 p-2 text-slate-800">
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className='text-red-500 text-xs'>{errors.confirmPassword.message}</span>
          )}

          {/* Correo Electrónico */}
          <label htmlFor="email" className='text-slate-800 mb-1 block text-sm'>Correo electrónico:</label>
          <input
            type="email"
            {...register("correo", {
              required: 'El correo electrónico es obligatorio'
            })}
            className='p-2 rounded block mb-1 border border-gray-800 text-slate-800 w-full'
            placeholder='Correo electrónico'
          />
          {errors.correo && (
            <span className='text-red-500 text-xs'>{errors.correo.message}</span>
          )}

          <div className='flex space-x-4'>
            <button className='w-full text-white p-2 bg-fuchsia-800 rounded-lg mt-2'>
              Registrarse
            </button>
            <a href="/login" className='w-full text-white text-center p-2 bg-fuchsia-800 rounded-lg mt-2'>
              Iniciar sesión
            </a>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
