import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { numeroContrato } = req.query
      const contrato = await prisma.contrato.findMany({
        where: {
          numero_contrato: parseInt(numeroContrato as string)
        },
        take: 1
      });
      const cobro = await prisma.cobro.findMany({
        where: {
          contratoId: contrato[0].id_contrato
        },
        take: 1
      });
      const actividades = await prisma.actividades.findMany({
        where: {
          cobroId: cobro[0].id
        },
      });

      res.status(200).json(
        {contrato: contrato[0],
          cobro: cobro[0],
          actividades: actividades
      }); 
    } catch (error) {
      console.error("Error al solicitar la información:", error); 
      res.status(500).json({ error: 'Error al solicitar la informacion' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido4' });
  }
}