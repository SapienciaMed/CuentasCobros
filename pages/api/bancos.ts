import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';
//Busca los bancos 
const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const bancos = await prisma.banco.findMany(); 
      res.status(200).json(bancos); 
    } catch (error) {
      console.error("Error al solicitar la información:", error); 
      res.status(500).json({ error: 'Error al solicitar la informacion' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido1' });
  }
}