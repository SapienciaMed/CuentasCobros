import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from "bcryptjs"; // Para hashear la contraseña

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verifica que el método de la solicitud sea GET
  if (req.method === 'GET') {
    // Extrae los parámetros de la solicitud (numeroCedula, token y password)
    const numeroCedula = Array.isArray(req.query.numeroCedula) ? req.query.numeroCedula[0] : req.query.numeroCedula;
    const token = Array.isArray(req.query.token) ? req.query.token[0] : req.query.token;
    const password = req.query.password;

    try {
      if (password) {
        // Caso 2: Si se proporciona una contraseña, se actualiza la contraseña del usuario
        const hashedPassword = await bcrypt.hash(password as string, 10); // Hashea la nueva contraseña

        // Actualiza el usuario con la nueva contraseña y resetea el token de recuperación
        const user = await prisma.user.update({
          where: {
            cedula: numeroCedula, // Busca por número de cédula
            tokenRecuperar: token // Valida el token de recuperación
          },
          data: {
            contrasena: hashedPassword, // Almacena la contraseña hasheada
            tokenRecuperar: "" // Resetea el token de recuperación después de cambiar la contraseña
          }
        });

        // Responde con el usuario actualizado
        res.status(200).json({ usuario: user });
      } else {
        // Caso 1: Si no se proporciona una contraseña, simplemente busca al usuario
        const user = await prisma.user.findUnique({
          where: {
            cedula: numeroCedula, // Busca por número de cédula
            tokenRecuperar: token // Valida el token de recuperación
          }
        });

        // Si el usuario es encontrado, responde con los datos del usuario
        if (user) {
          res.status(200).json({ usuario: user });
        } else {
          // Si no se encuentra el usuario, responde con un error 404
          res.status(404).json({ error: 'Usuario no encontrado' });
        }
      }
    } catch (error) {
      // Si ocurre un error durante el procesamiento, responde con un código 500
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  } else {
    // Si el método no es GET, responde con un error 405 (Método no permitido)
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}