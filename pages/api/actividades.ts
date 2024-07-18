import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { objetos_contractuales, cobroId } = req.body;

        try {
            const cobro = await prisma.cobro.findUnique({
                where: { id: cobroId }
            });

            for (const objeto of objetos_contractuales) {
                const nuevaActividad = await prisma.actividades.create({
                    data: {
                        objeto_contractual: objeto,
                        cobro: { connect: { id: cobroId } },
                    },
                });
            }

            res.status(201).json({ mensaje: 'Actividades creadas correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear las actividades' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido2' });
    }
}