import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Verifica que el método de la solicitud sea POST
    if (req.method === 'POST') {
        // Extrae los campos del cuerpo de la solicitud
        const { apellidos, correoElectronico, direccion, nombres, telefono } = req.body;
        const bancoId = parseInt(req.body.bancoId); // Convierte el bancoId a número
        const tipoCuentaId = parseInt(req.body.tipoCuentaId); // Convierte el tipoCuentaId a número
        const nro_cuenta = parseInt(req.body.nro_cuenta); // Convierte el nro_cuenta a número
        const contratoId = parseInt(req.body.contratoId); // Convierte el contratoId a número
        const documento = parseInt(req.body.documento); // Convierte el documento a número
        const identificacionFiscal = parseInt(req.body.identificacionFiscal); // Convierte la identificación fiscal a número

        try {
            let banco, contrato, tipoCuenta;

            // Verificar si el banco existe en la base de datos
            try {
                banco = await prisma.banco.findUnique({
                    where: { id_banco: bancoId }
                });
            } catch (error) {
                console.log('Error al obtener el banco:', error);
                return res.status(500).json({ error: 'Error al obtener el banco' });
            }

            // Verificar si el contrato existe en la base de datos
            try {
                contrato = await prisma.contrato.findUnique({
                    where: { id_contrato: contratoId }
                });
            } catch (error) {
                console.log('Error al obtener el contrato:', error);
                return res.status(500).json({ error: 'Error al obtener el contrato' });
            }

            // Verificar si el tipo de cuenta existe en la base de datos
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
                    banco: { connect: { id_banco: bancoId } }, // Conecta con el banco
                    contrato: { connect: { id_contrato: contratoId } }, // Conecta con el contrato
                    correoElectronico,
                    direccion,
                    documento,
                    identificacionFiscal,
                    nombres,
                    telefono,
                    tipoCuenta: { connect: { id_cuenta: tipoCuentaId } }, // Conecta con el tipo de cuenta
                    nro_cuenta, // Almacena el número de cuenta
                },
            });

            // Responde con un mensaje de éxito y el ID del cobro creado
            res.status(201).json({
                mensaje: 'Cobro creado correctamente',
                cobroId: nuevoCobro.id
            });
        } catch (error) {
            // Si hay un error al crear el cobro, responde con un código 500 y un mensaje de error
            console.log('Error al crear el cobro:', error);
            res.status(500).json({ error: 'Error al crear el cobro' });
        }
    } else {
        // Si el método no es POST, responde con un error 405 (Método no permitido)
        res.status(405).json({ error: 'Método no permitido' });
    }
}