import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Verifica que el método de la solicitud sea POST
    if (req.method === 'POST') {
        // Extrae los objetos contractuales y el ID del cobro del cuerpo de la solicitud
        const { objetos_contractuales, cobroId } = req.body;

        try {
            // Itera sobre cada objeto contractual en el array recibido
            for (const objeto of objetos_contractuales) {
                // Crea una nueva actividad en la tabla 'actividades' y la asocia al cobro por su ID
                await prisma.actividades.create({
                    data: {
                        objeto_contractual: objeto, // Almacena el objeto contractual
                        cobro: {
                            connect: { id: cobroId } // Conecta la actividad al cobro existente usando el ID
                        }
                    },
                });
            }

            // Responde con un mensaje de éxito si todas las actividades fueron creadas correctamente
            res.status(201).json({ mensaje: 'Actividades creadas correctamente' });
        } catch (error) {
            // Si hay un error, responde con un código 500 y un mensaje de error
            console.error(error);
            res.status(500).json({ error: 'Error al crear las actividades' });
        }
    } else {
        // Si el método no es POST, responde con un error 405 (Método no permitido)
        res.status(405).json({ error: 'Método no permitido' });
    }
}