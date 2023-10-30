const { Pool } = require('pg');

const pool = new Pool({
  user: 'csce315_902_02user',
  host: 'csce-315-db.engr.tamu.edu',
  database: 'csce315_902_02db',
  password: 'h3gx9MxT',
  port: 5432, // PostgreSQL default port
});

