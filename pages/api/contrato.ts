import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const objetoContrato = req.body.objeto_contrato;
        const numeroContrato = parseInt(req.body.numero_contrato);
        const anoContrato = parseInt(req.body.ano_contrato);
        const valorMes = parseFloat(req.body.valor_mes);
        try {
            const nuevoContrato = await prisma.contrato.create({
                data: {
                    numero_contrato: numeroContrato, 
                    objeto_contrato: objetoContrato, 
                    ano_contrato: anoContrato,
                    valor_mes: valorMes,
                },
            });

            res.status(201).json({
                mensaje: 'Contrato creado correctamente',
                contratoId: nuevoContrato.id_contrato
            });
        } catch (error) {
            console.error('Error al crear el contrato:', error); 
            res.status(500).json({ error: 'Error al crear el contrato' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}