import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { nombre_completo, cedula, correo, contraseña, confirmPassword } = req.body;
    if(confirmPassword === contraseña){
      try {
        const hashedPassword = await bcrypt.hash(contraseña, 3);
  
        const user = await prisma.user.create({
          data: {
            cedula: cedula,
            nombre_completo: nombre_completo,
            correoElectronico: correo,
            contrasena: hashedPassword
          }
        });
  
        res.status(201).json(user); // Responde con el usuario creado
  
      } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
      }
    }else{
      res.status(405).end(`Las contraseñas no coinciden`);
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido, Las contraseñas no son iguales`);
  }
}