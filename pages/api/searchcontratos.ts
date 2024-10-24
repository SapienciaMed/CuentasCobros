import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/pages/api/lib/db';
import { RowDataPacket } from 'mysql2';

// Definición de interfaces para estructurar los datos del empleado, contratos y banco
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
  // Verificamos que el método de la solicitud sea 'GET'
  if (req.method === 'GET') {
    try {
      // Obtenemos el parámetro 'numeroCedula' de la consulta
      const { numeroCedula } = req.query;

      // Validación del parámetro: Verificamos que exista y sea un string
      if (!numeroCedula || typeof numeroCedula !== 'string') {
        res.status(400).json({ error: 'Parámetro número de cédula inválido' });
        return;
      }

      // Consulta para obtener la información del empleado a partir de la identificación
      const [empleadoRows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM empleados WHERE identificacion = ? LIMIT 1',
        [numeroCedula]
      );

      // Si no se encuentra el empleado, retornamos un error 404
      if (empleadoRows.length === 0) {
        res.status(404).json({ error: 'Empleado no encontrado' });
        return;
      }

      // Convertimos el resultado de la consulta en un objeto 'Empleado'
      const empleado: Empleado = empleadoRows[0] as Empleado;

      // Consulta para obtener los contratos asociados al empleado
      const [contratosResult] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM contratos WHERE empleado_id = ? ORDER BY id DESC',
        [empleado.id]
      );

      // Convertimos los resultados de los contratos en un arreglo de objetos 'Contrato'
      const contratos: Contrato[] = contratosResult.map((contratoRow) => ({
        id: contratoRow.id,
        nro_contrato: contratoRow.nro_contrato,
        objeto: contratoRow.objeto,
        empleado_id: contratoRow.empleado_id,
      }));

      // Consulta para obtener la información de todos los bancos
      const [bancoResult] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM bancos'
      );

      // Convertimos los resultados de la consulta de bancos en un arreglo de objetos 'Banco'
      const bancos: Banco[] = bancoResult.map((bancoRow) => ({
        id_banco: bancoRow.id_banco,
        nombre: bancoRow.nombre,
      }));

      // Asignamos los contratos obtenidos y los bancos al objeto empleado
      empleado.contratos = contratos;
      empleado.id_banco = bancos.length > 0 ? bancos : null; // Asignamos bancos solo si existen

      // Imprimimos el objeto empleado en la consola para verificar los datos (opcional)
      console.log(empleado);

      // Respondemos con un código 200 y enviamos el objeto 'Empleado' como JSON
      res.status(200).json({ data: empleado });
    } catch (error) {
      // Manejamos cualquier error durante la ejecución y devolvemos un código 500 (Error del servidor)
      console.error("Error al solicitar la información:", error);
      res.status(500).json({ error: 'Error al solicitar la información' });
    }
  } else {
    // Si el método no es 'GET', devolvemos un error 405 (Método no permitido)
    res.status(405).json({ error: 'Método no permitido' });
  }
}
