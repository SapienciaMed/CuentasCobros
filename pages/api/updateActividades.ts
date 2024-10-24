import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { objetos_contractuales, cobroId } = req.body;

        try {
            for (const objeto of objetos_contractuales) {
                if(objeto.id != 'null'){
                    await prisma.actividades.update({
                        where: { id_actividades: parseInt(objeto.id) }, 
                        data: {
                            objeto_contractual: objeto.value, 
                            cobro: { connect: { id: parseInt(cobroId) } },
                        },
                    });
                }else{
                    await prisma.actividades.create({
                        data: {
                            objeto_contractual: objeto.value,
                            cobro: { connect: { id: parseInt(cobroId) } },
                        },
                    })
                }   
            }

            res.status(201).json({ mensaje: 'Actividades creadas correctamente' });
        } catch (error) {
            console.error('Error al crear las actividades:', error);
            res.status(500).json({ error: 'Error al crear las actividades' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}