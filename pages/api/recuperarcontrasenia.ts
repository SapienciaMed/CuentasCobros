import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { cedula, contraseña } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { cedula: cedula }
      });

      if (user && user.contrasena === contraseña) {
        return res.status(201).json(user);
      } else {
        if (user) {
          const token = crypto.randomBytes(20).toString('hex');

          await prisma.user.update({
            where: { id: user.id },
            data: { tokenRecuperar: token }
          });

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'cuenta.cobro@sapiencia.gov.co',
              pass: 'dqyb sbfa xjus yfnc'
            }
          });

          const mailOptions = {
            from: 'cuenta.cobro@sapiencia.gov.co',
            to: user.correoElectronico,
            subject: 'Recuperación de contraseña',
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña: http://localhost:3000/reset-password/${token}/${cedula}`
          };

          // Usar await para esperar el resultado del envío de correo
          const info = await transporter.sendMail(mailOptions);
          console.log('Correo electrónico de recuperación de contraseña enviado: ' + info.response);
          res.status(200).json({ message: 'Se ha enviado un correo electrónico de recuperación de contraseña', user: { correoElectronico: user.correoElectronico } });
        } else {
          return res.status(400).json({ error: 'Usuario no encontrado o contraseña incorrecta' });
        }
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error al acceder al usuario: ' + error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }
}