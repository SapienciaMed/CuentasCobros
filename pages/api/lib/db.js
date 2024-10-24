import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '35.202.252.42',        
  user: 'sapiencia',
  password: 'Sap2016',
  database: 'sapiencia',
  waitForConnections: true,
  connectionLimit: 0,
  queueLimit: 0
});

export default pool;