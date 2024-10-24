import { PrismaClient as PrismaClientInfocontratos } from "@prisma/client"; // Para la base de datos infocontratos
import { NextApiRequest, NextApiResponse } from 'next';

const prismaInfocontratos = new PrismaClientInfocontratos();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Verifica que el método de la solicitud sea POST
    if (req.method === 'POST') {
        // Extrae los campos del cuerpo de la solicitud
        const objetoContrato = req.body.objeto_contrato; // Descripción del objeto del contrato
        const dependencia = req.body.dependencia; // Dependencia asociada al contrato
        const numeroContrato = parseInt(req.body.numero_contrato); // Número del contrato, convertido a número
        const anoContrato = parseInt(req.body.ano_contrato); // Año del contrato, convertido a número
        const valorMes = parseFloat(req.body.valor_mes); // Valor mensual del contrato, convertido a decimal

        try {
            // Busca los bancos en la base de datos 'infocontratos'
            const bancos = await prismaInfocontratos.banco.findMany();

            // Comprueba si hay bancos disponibles en la base de datos
            if (bancos.length === 0) {
                return res.status(404).json({ error: 'No se encontraron bancos' });
            }

            // Crea un nuevo registro de contrato en la base de datos 'infocontratos'
            const nuevoContrato = await prismaInfocontratos.contrato.create({
                data: {
                    numero_contrato: numeroContrato, // Número del contrato
                    objeto_contrato: objetoContrato, // Objeto del contrato
                    ano_contrato: anoContrato, // Año del contrato
                    valor_mes: valorMes, // Valor mensual del contrato
                    dependencia: dependencia, // Dependencia que firma el contrato
                },
            });

            // Responde con un mensaje de éxito, el ID del contrato creado y la lista de bancos
            res.status(201).json({
                mensaje: 'Contrato creado correctamente',
                contratoId: nuevoContrato.id_contrato, // ID del contrato recién creado
                bancos, // Lista de bancos obtenida
            });
        } catch (error) {
            // Si ocurre un error, responde con un código 500 y un mensaje de error
            console.error('Error al buscar los bancos o crear el contrato:', error); 
            res.status(500).json({ error: 'Error al buscar los bancos o crear el contrato' });
        }
    } else {
        // Si el método no es POST, responde con un error 405 (Método no permitido)
        res.status(405).json({ error: 'Método no permitido' });
    }
}
