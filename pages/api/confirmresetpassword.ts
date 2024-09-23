import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const numeroCedula = Array.isArray(req.query.numeroCedula) ? req.query.numeroCedula[0] : req.query.numeroCedula;
    const token = Array.isArray(req.query.token) ? req.query.token[0] : req.query.token;
    const password = req.query.password;

    try {
      if (password) {
        // Caso 2: Actualizar la contraseña del usuario
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.update({
          where: {
            cedula: numeroCedula,
            tokenRecuperar: token
          },
          data: {
            contrasena: hashedPassword,
            tokenRecuperar: ""
          }
        });

        res.status(200).json({ usuario: user });
      } else {
        // Caso 1: Buscar al usuario
        const user = await prisma.user.findUnique({
          where: {
            cedula: numeroCedula,
            tokenRecuperar: token
          }
        });

        if (user) {
          res.status(200).json({ usuario: user });
        } else {
          res.status(404).json({ error: 'Usuario no encontrado' });
        }
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}