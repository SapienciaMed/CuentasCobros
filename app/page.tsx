"use client"; // Esto indica que es un Client Component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importa desde 'next/navigation'

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a /login cuando se carga la página
    router.push('/login');
  }, [router]);

  return null; // o un mensaje de carga opcional
};

export default Home;
