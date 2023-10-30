import { Pool } from 'pg';

let connection;

if (!connection) {
    connection = new Pool({
        user: "csce315_902_02user",
        password: "h3gx9MxT",
        host: "csce-315-db.engr.tamu.edu",
        port: "",
        database: "csce315_902_02db"
    });
}

export default connection;