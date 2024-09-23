import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { numeroCedula } = req.query;
      const cobro = await prisma.cobro.findFirst({
        where: {documento: parseInt(numeroCedula as string)},
        orderBy: {
          id: 'desc'
        }
      })
      const contrato = await prisma.contrato.findUnique({
        where: {
          id_contrato: cobro?.contratoId
        }
      });
      const actividades = await prisma.actividades.findMany({
        where: {
          cobroId: cobro?.id
        },
      });

      res.status(200).json(
        {contrato: contrato,
          cobro: cobro,
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