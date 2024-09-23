import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { cedula, contraseña } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: {cedula: cedula}
      });
      const login = {
        correo: user?.correoElectronico,
        cedula: user?.cedula
      }
      if(await bcrypt.compare(contraseña, user?.contrasena)){
        res.status(201).json(login);
      }else{
        res.status(500).json({ error: 'Error al acceder al usuario: Contraseña incorrecta'});
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al acceder al usuario: '+ error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}