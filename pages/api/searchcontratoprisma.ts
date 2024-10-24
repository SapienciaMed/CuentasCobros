import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// Definición de interfaces para estructurar el tipo de datos de contrato, banco, actividades y empleado
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
  id_fiscal: string;
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
  actividades: Actividades[] | null;
}

// Inicializamos PrismaClient para interactuar con la base de datos
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificamos que el método sea 'GET', si no, devolvemos un error
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  // Obtenemos el parámetro de la cédula desde la query
  const { numeroCedula } = req.query;

  // Validamos que el parámetro número de cédula exista y sea un string
  if (!numeroCedula || typeof numeroCedula !== 'string') {
    res.status(400).json({ error: 'Parámetro número de cédula inválido' });
    return;
  }

  try {
    // Buscamos el cobro más reciente asociado con la cédula del empleado
    const cobro = await prisma.cobro.findFirst({
      where: { documento: parseInt(numeroCedula) },
      orderBy: {
        id: 'desc', // Ordenamos para obtener el cobro más reciente
      },
    });

    // Si no se encuentra un cobro, devolvemos un error
    if (!cobro) {
      res.status(404).json({ error: 'Cobro no encontrado' });
      return;
    }

    // Buscamos el contrato asociado al cobro
    const contrato = await prisma.contrato.findUnique({
      where: { id_contrato: cobro.contratoId },
    });

    // Obtenemos la lista de bancos disponibles
    const bancos = await prisma.banco.findMany();

    // Si no se encuentra un contrato, devolvemos un error
    if (!contrato) {
      res.status(404).json({ error: 'Contrato no encontrado' });
      return;
    }

    // Transformamos el contrato para ajustarlo al tipo de datos definido
    const contratoTransformado: Contrato = {
      id: contrato?.id_contrato ?? 0, // Si no hay contrato, devolvemos un id 0
      nro_contrato: contrato?.numero_contrato.toString() ?? '',
      objeto: contrato?.objeto_contrato ?? '',
      empleado_id: 0, // Este campo puede ser actualizado si se necesita más información
      dependencia: contrato?.dependencia ?? 'N/A',
      valor_mes: contrato?.valor_mes ?? 0,
    };

    // Transformamos la lista de bancos obtenida
    const bancosTransformados: Banco[] = bancos.map(element => ({
      id_banco: element?.id_banco ?? 1,
      nombre: element?.nombre ?? "Bancolombia", // Por defecto, asignamos "Bancolombia" si no hay nombre
    }));

    // Buscamos el tipo de cuenta asociado al cobro
    const tipoCuenta = await prisma.tipoCuenta.findUnique({
      where: { id_cuenta: cobro.tipoCuentaId },
    });

    // Buscamos las actividades relacionadas con el cobro
    const actividades = await prisma.actividades.findMany({
      where: { cobroId: cobro.id },
    });

    // Buscamos el banco relacionado con el cobro
    const banco = await prisma.banco.findUnique({
      where: { id_banco: cobro.bancoId },
    });

    // Transformamos los datos del banco
    const bancoTransformado: Banco = {
      id_banco: banco?.id_banco ?? 1,
      nombre: banco?.nombre ?? "Bancolombia",
    };

    // Creamos el objeto empleado con toda la información obtenida
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
      id_banco: bancosTransformados,
      banco_empleado: bancoTransformado,
      contratos: contratoTransformado,
      actividades: actividades,
    };

    // Devolvemos la respuesta con la información del empleado
    res.status(200).json({ data: empleado });
  } catch (error) {
    console.error('Error al solicitar la información:', error);
    // En caso de error, devolvemos una respuesta con el error
    res.status(500).json({ error: 'Error al solicitar la información' });
  }
}
