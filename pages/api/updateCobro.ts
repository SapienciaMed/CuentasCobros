import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { apellidos, correoElectronico, direccion, nombres, telefono } = req.body;
        const bancoId = parseInt(req.body.bancoId);
        const tipoCuentaId = parseInt(req.body.tipoCuentaId);
        const nro_cuenta = parseInt(req.body.nro_cuenta);
        const contratoId = parseInt(req.body.contratoId);
        const documento = parseInt(req.body.documento);
        const identificacionFiscal = parseInt(req.body.identificacionFiscal);
        const id_cobro = parseInt(req.body.id_cobro);

        try {
            // Obtener el banco
            const banco = await prisma.banco.findUnique({
                where: { id_banco: bancoId }
            });

            if (!banco) {
                return res.status(404).json({ error: 'Banco no encontrado' });
            }

            // Obtener el contrato
            const contrato = await prisma.contrato.findUnique({
                where: { id_contrato: contratoId }
            });

            if (!contrato) {
                return res.status(404).json({ error: 'Contrato no encontrado' });
            }

            // Obtener el tipo de cuenta
            const tipoCuenta = await prisma.tipoCuenta.findUnique({
                where: { id_cuenta: tipoCuentaId }
            });

            if (!tipoCuenta) {
                return res.status(404).json({ error: 'Tipo de cuenta no encontrado' });
            }

            // Actualizar el cobro con los objetos relacionados completos
            const updateCobro = await prisma.cobro.update({
                where: { id: id_cobro },
                data: {
                    apellidos,
                    banco: { connect: { id_banco: bancoId } },
                    contrato: { connect: { id_contrato: contratoId } },
                    correoElectronico,
                    direccion,
                    documento,
                    identificacionFiscal,
                    nombres,
                    telefono,
                    tipoCuenta: { connect: { id_cuenta: tipoCuentaId } },
                    nro_cuenta,
                },
            });

            res.status(200).json({
                mensaje: 'Cobro actualizado correctamente',
                cobroId: updateCobro.id
            });
        } catch (error) {
            console.log('Error al actualizar el cobro:', error);
            res.status(500).json({ error: 'Error al actualizar el cobro' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}