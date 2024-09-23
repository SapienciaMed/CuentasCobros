import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const objetoContrato = req.body.objeto_contrato;
        const dependencia = req.body.dependencia;
        const numeroContrato = parseInt(req.body.numero_contrato);
        const anoContrato = parseInt(req.body.ano_contrato);
        const valorMes = parseFloat(req.body.valor_mes);
        const id_contrato = parseInt(req.body.id_contrato);

        try {
            const updatedContrato = await prisma.contrato.update({
                where: { id_contrato: id_contrato },
                data: {
                    numero_contrato: numeroContrato,
                    objeto_contrato: objetoContrato,
                    ano_contrato: anoContrato,
                    valor_mes: valorMes,
                    dependencia: dependencia,
                },
            });

            res.status(200).json({
                mensaje: 'Contrato actualizado correctamente',
                contratoId: updatedContrato.id_contrato
            });
        } catch (error) {
            console.error('Error al actualizar el contrato:', error); 
            res.status(500).json({ error: 'Error al actualizar el contrato' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}