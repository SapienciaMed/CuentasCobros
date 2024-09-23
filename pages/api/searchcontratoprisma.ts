import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import pool from '@/pages/api/lib/db';
import { RowDataPacket } from 'mysql2';
import { Corben } from 'next/font/google';

// Definición de interfaces
interface Contrato {
  id: number;
  nro_contrato: string;
  objeto: string;
  empleado_id: number;
  dependencia: string;
  valor_mes: number;
}

interface Banco {
  id_banco: number;
  nombre: string;
}

interface Actividades {
  id_actividades: number;
  objeto_contractual: string;
  cobroId: number;
}

interface Empleado {
  id: number;
  identificacion: string;
  id_fiscal: string,
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  direccion: string;
  telefono: string;
  email: string;
  nro_cuenta: string | null;
  tipo_cuenta: string | null;
  id_banco: Banco[] | null;
  banco_empleado: Banco;
  contratos: Contrato | null;
  actividades: Actividades[] | null; // Corregido
}


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { numeroCedula } = req.query;

  if (!numeroCedula || typeof numeroCedula !== 'string') {
    res.status(400).json({ error: 'Parámetro número de cédula inválido' });
    return;
  }

  try {
    // Asigna el resultado de la consulta a la variable empleado

    // Consulta con Prisma para encontrar el cobro relacionado al empleado
    const cobro = await prisma.cobro.findFirst({
      where: { documento: parseInt(numeroCedula) },
      orderBy: {
        id: 'desc',
      },
    });

    // Si no se encuentra un cobro, se envía una respuesta con error
    if (!cobro) {
      res.status(404).json({ error: 'Cobro no encontrado' });
      return;
    }

    // Consulta con Prisma para encontrar el contrato relacionado al cobro
    const contrato = await prisma.contrato.findUnique({
      where: { id_contrato: cobro.contratoId },
    });
    const bancos = await prisma.banco.findMany();

    // Si no se encuentra un contrato, se envía una respuesta con error
    if (!contrato) {
      res.status(404).json({ error: 'Contrato no encontrado' });
      return;
    }
    const contratoTransformado: Contrato = {
      id: contrato?.id_contrato ?? 0, // Asegúrate de manejar posibles valores nulos
      nro_contrato: contrato?.numero_contrato.toString() ?? '',
      objeto: contrato?.objeto_contrato ?? '',
      empleado_id: 0,
      dependencia: contrato?.dependencia ?? 'N/A',
      valor_mes: contrato?.valor_mes ?? 0,
    };
    const bancosTransformados: Banco[] = bancos.map(element => ({
      id_banco: element?.id_banco ?? 1,
      nombre: element?.nombre ?? "Bancolombia"
    }));
    
    const tipoCuenta = await prisma.tipoCuenta.findUnique({
      where: {id_cuenta: cobro.tipoCuentaId}
    })
    const actividades = await prisma.actividades.findMany({
      where: {cobroId: cobro.id}
    })
    const banco = await prisma.banco.findUnique({
      where: {id_banco: cobro.bancoId}
    })

    const bancoTransformado: Banco = {
      id_banco: banco?.id_banco ?? 1,
      nombre: banco?.nombre ?? "Bancolombia"
    };

    const empleado: Empleado = {
      id: cobro.id,
      identificacion: cobro.documento.toString(),
      id_fiscal: cobro.identificacionFiscal.toString(),
      primer_nombre: cobro.nombres.split(' ')[0] || '',
      segundo_nombre: cobro.nombres.split(' ')[1] || '',
      primer_apellido: cobro.apellidos.split(' ')[0] || '',
      segundo_apellido: cobro.apellidos.split(' ')[1] || '',
      direccion: cobro.direccion,
      telefono: cobro.telefono,
      email: cobro.correoElectronico,
      nro_cuenta: cobro.nro_cuenta ? cobro.nro_cuenta.toString() : null,
      tipo_cuenta: tipoCuenta?.tipo_cuenta || null,
      id_banco : bancosTransformados,
      banco_empleado:bancoTransformado,
      contratos : contratoTransformado,
      actividades: actividades
    }

    res.status(200).json({ data: empleado });
  } catch (error) {
    console.error('Error al solicitar la información:', error);
    res.status(500).json({ error: 'Error al solicitar la información' });
  }
}
