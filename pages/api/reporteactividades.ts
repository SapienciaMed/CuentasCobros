import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verifica si el método de la solicitud es GET
  if (req.method === 'GET') {
    try {
      // Extrae el número de cédula del query de la solicitud
      const { numeroCedula } = req.query;

      // Busca el cobro más reciente asociado al número de cédula proporcionado
      const cobro = await prisma.cobro.findFirst({
        where: { documento: parseInt(numeroCedula as string) }, // Filtra por el campo 'documento' usando el número de cédula
        orderBy: {
          id: 'desc' // Ordena los resultados por 'id' en orden descendente para obtener el último cobro
        }
      });

      // Si se encuentra un cobro, busca el contrato asociado
      const contrato = await prisma.contrato.findUnique({
        where: {
          id_contrato: cobro?.contratoId // Utiliza el ID del contrato desde el cobro
        }
      });

      // Busca todas las actividades relacionadas con el cobro
      const actividades = await prisma.actividades.findMany({
        where: {
          cobroId: cobro?.id // Filtra las actividades por el ID del cobro
        },
      });

      // Responde con los detalles del contrato, cobro y actividades encontradas
      res.status(200).json({
        contrato: contrato, // Información del contrato
        cobro: cobro, // Detalles del cobro
        actividades: actividades // Lista de actividades relacionadas con el cobro
      });
    } catch (error) {
      // Si ocurre un error durante el proceso, responde con un código 500 y un mensaje de error
      console.error("Error al solicitar la información:", error);
      res.status(500).json({ error: 'Error al solicitar la información' });
    }
  } else {
    // Si el método no es GET, responde con un error 405 (Método no permitido)
    res.status(405).json({ error: 'Método no permitido' });
  }
}