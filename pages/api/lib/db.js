import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '104.154.153.252',        
  user: 'root',
  password: 'c0nv0c4t0r14s.S4p',
  database: 'sapiencia',
  waitForConnections: true,
  connectionLimit: 0,
  queueLimit: 0
});

export default pool;