import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/pages/api/lib/db';
import { RowDataPacket } from 'mysql2';

interface Contrato {
  id: number;
  nro_contrato: string;
  objeto: string;
  empleado_id: number;
}

interface Empleado {
  id: number;
  email: string;
  identificacion: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  direccion: string;
  telefono: string;
  nro_cuenta: string;
  tipo_cuenta: string;
  contratos: Contrato[]; // Actualizamos para reflejar una lista de contratos
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { numeroCedula } = req.query;

      // Validación básica del parámetro
      if (!numeroCedula || typeof numeroCedula !== 'string') {
        res.status(400).json({ error: 'Parámetro número de cédula inválido' });
        return;
      }

      // Consulta para obtener la información del empleado
      const [empleadoRows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM empleados WHERE identificacion = ? LIMIT 1',
        [numeroCedula]
      );

      if (empleadoRows.length === 0) {
        res.status(404).json({ error: 'Empleado no encontrado' });
        return;
      }

      const empleado: Empleado = empleadoRows[0] as Empleado;

      const [contratosResult] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM contratos WHERE empleado_id = ? ORDER BY id DESC',
        [empleado.id]
      );

      const contratos: Contrato[] = contratosResult.map((contratoRow) => ({
        id: contratoRow.id,
        nro_contrato: contratoRow.nro_contrato,
        objeto: contratoRow.objeto,
        empleado_id: contratoRow.empleado_id,
      }));

      empleado.contratos = contratos;
      res.status(200).json({ data: empleado });
    } catch (error) {
      console.error("Error al solicitar la información:", error); 
      res.status(500).json({ error: 'Error al solicitar la información' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
