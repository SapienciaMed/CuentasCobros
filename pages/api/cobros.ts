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

        try {
            let banco, contrato, tipoCuenta;
            try {
                banco = await prisma.banco.findUnique({
                    where: { id_banco: bancoId }
                });
            } catch (error) {
                console.log('Error al obtener el banco:', error);
                return res.status(500).json({ error: 'Error al obtener el banco' });
            }

            try {
                contrato = await prisma.contrato.findUnique({
                    where: { id_contrato: contratoId }
                });
            } catch (error) {
                console.log('Error al obtener el contrato:', error);
                return res.status(500).json({ error: 'Error al obtener el contrato' });
            }

            try {
                tipoCuenta = await prisma.tipoCuenta.findUnique({
                    where: { id_cuenta: tipoCuentaId }
                });
            } catch (error) {
                console.log('Error al obtener el tipo de cuenta:', error);
                return res.status(500).json({ error: 'Error al obtener el tipo de cuenta' });
            }

            // Crear el nuevo cobro con los objetos relacionados completos
            const nuevoCobro = await prisma.cobro.create({
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

            res.status(201).json({
                mensaje: 'Cobro creada correctamente',
                cobroId: nuevoCobro.id
            });
        } catch (error) {
            console.log('Error al crear el cobro:', error);
            res.status(500).json({ error: 'Error al crear el cobro' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido3' });
    }
}