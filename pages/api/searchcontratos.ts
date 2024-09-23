import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/pages/api/lib/db';
import { RowDataPacket } from 'mysql2';

interface Contrato {
  id: number;
  nro_contrato: string;
  objeto: string;
  empleado_id: number;
}

interface Banco {
  id_banco: number;
  nombre: string;
}

interface Empleado {
  id: number;
  documento_id: number;
  identificacion: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  direccion: string;
  telefono: string;
  email: string;
  autobuscar: string;
  created_at: Date;
  updated_at: Date;
  clasificacion: string;
  salud: string;
  pensiones: string;
  arl: string;
  eps: string | null;
  pension: string | null;
  arp: string | null;
  caja_compensacion: string | null;
  cesantias: string | null;
  nivel_riesgo: string | null;
  nro_cuenta: string | null;
  entidad: string | null;
  tipo_cuenta: string | null;
  fondo_cesantias: string | null;
  fecha_nac: Date;
  rh: string;
  id_banco: Banco[] | null;
  contratos: Contrato[];
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

      // Consulta para obtener la información de los bancos
      const [bancoResult] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM bancos'
      );

      // Convertir el resultado de la consulta de bancos a un arreglo de objetos Banco
      const bancos: Banco[] = bancoResult.map((bancoRow) => ({
        id_banco: bancoRow.id_banco,
        nombre: bancoRow.nombre,
      }));

      // Asignar los contratos y bancos al objeto empleado
      empleado.contratos = contratos;
      empleado.id_banco = bancos.length > 0 ? bancos : null; // Asignar bancos si existen

      console.log(empleado);
      res.status(200).json({ data: empleado });
    } catch (error) {
      console.error("Error al solicitar la información:", error); 
      res.status(500).json({ error: 'Error al solicitar la información' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
