import connection from '../../../backend/database';

export default async (req, res) => {
    // uncomment to print json req to console
    // console.log(req.body);

    // Here we handle all sql statements as a transaction so
    // can ensure that it is all handled as one unit
    // to avoid race conditions

    const client = await connection.connect();

    // push order to database
    try {
        await client.query('BEGIN;');

        const getRoleQuery = `
        SELECT 
            employee_title 
        FROM
            employees
        WHERE
            employee_email = $1;`

        const getRoleParams = [req.body.employee_email];

        const result = await client.query(getRoleQuery, getRoleParams);
        //console.log(result.rows);
        res.status(200).json(result.rows);
    } catch (error) {
        // disregard if an error is caught
        await client.query('ROLLBACK;');
        throw error;
    } finally {
        // release client back into the pool
        client.release();
    }
};