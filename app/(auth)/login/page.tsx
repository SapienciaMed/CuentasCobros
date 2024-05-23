'use client';
import { useForm } from 'react-hook-form';

import React from 'react'



function Loginpage() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = handleSubmit(data => {
    console.log(data)
  })

  return (
    <div className='h-[calc(100vh-7rem)] flex justify-center items-center'>
      <form onSubmit={onSubmit} className='w-1/4'>
        <h1 className='text-slate-200 font-bold text-4xl mb-4'>Login</h1>
        <label htmlFor="username" className='text-slate-500 mb-2 block text-sm'>Nombre:</label>
        <input
          type="text"
          {...register("username", {
            required: {
              value: true,
              message: 'El nombre completo es obligatorio'
            }
          })}
          className='p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full'
          placeholder='Nombre Completo'
        />
        {errors.username && (
          <span className='text-red-500 text-xs'>{errors.username.message}</span>
        )}


        <label htmlFor="password" className='text-slate-500 mb-2 block text-sm'>Contraseña:</label>
        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: 'La contraseña es obligatoria'
            }
          })}
          className='p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full'
          placeholder='Contraseña'
        />
        {errors.password && (
          <span className='text-red-500 text-xs'>{errors.password.message}</span>
        )}
        <button className='w-full bg-blue-500 text-white p-3 rounded-lg mt-2'>
          Login
        </button>


      </form>
    </div>
  )
}

export default Loginpage