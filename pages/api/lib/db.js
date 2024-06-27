import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',        
  user: 'root',
  password: '',
  database: 'prueba_datos',
  waitForConnections: true,
  connectionLimit: 0,
  queueLimit: 0
});

export default pool;