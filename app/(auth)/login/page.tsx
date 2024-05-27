'use client';
import { useForm } from 'react-hook-form';

import React from 'react'



function Loginpage() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = handleSubmit(data => {
    console.log(data)
  })
  



  return (
    <div className='flex flex-col items-center justify-center mt-10'>
      <img
        src="https://sapiencia.gov.co/wp-content/uploads/2022/07/sapiencia-vertical-png.png"
        className='mb-4 w-60 h-auto'
        alt="Flowbite Logo"
      />
      <form onSubmit={onSubmit} className='w-full max-w-xs mt-4'> 
        <h1 className='text-slate-800 font-bold text-xl mb-2'>Login</h1>
        <hr className='mb-4 mt-4' />
        <label htmlFor="username" className='text-slate-800 mb-1 block text-sm'>Nombre:</label>
        <input
          type="text"
          {...register("username", {
            required: {
              value: true,
              message: 'El nombre completo es obligatorio'
            }
          })}
          className='p-2 rounded block mb-2 border border-gray-800 text-slate-800 w-full'
          placeholder='Nombre Completo'
        />
        {errors.username && (
          <span className='text-red-500 text-xs'>{errors.username.message}</span>
        )}

        <label htmlFor="password" className='text-slate-800 mb-1 block text-sm'>Contraseña:</label>
        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: 'La contraseña es obligatoria'
            }
          })}
          className='p-2 rounded block mb-2 border border-gray-800 text-slate-800 w-full'
          placeholder='Contraseña'
        />
        {errors.password && (
          <span className='text-red-500 text-xs'>{errors.password.message}</span>
        )}
        <button className='w-full text-white p-2 bg-fuchsia-800 rounded-lg mt-2'>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Loginpage;