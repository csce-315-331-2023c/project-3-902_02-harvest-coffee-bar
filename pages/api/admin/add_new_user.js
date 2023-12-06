import connection from '../../../backend/database'

export default async (req, res) => {

    // check if POST req
    if (req.method != 'POST') {
        res.status(405).send({ message: 'Invalid request: Only POST reqs allowed' });
        return;
    }

    // uncomment to print json req to console
    // console.log(req.body);

    // Here we handle all sql statements as a transaction so 
    // can ensure that it is all handled as one unit
    // to avoid race conditions

    const client = await connection.connect();

    //push order to database
    try {

        await client.query('BEGIN;');

        // grab new order id
        const newIdQuery = await connection.query("SELECT MAX(employee_id) + 1 as new_id FROM employees;");
        const newUserID = newIdQuery.rows[0].new_id;

        // push order to database
        const addNewUserStatement = `
                INSERT INTO
                    employees(employee_id, employee_name, employee_title, employee_email)
                VALUES 
                    ($1, $2, $3, $4);
                `;

        const userParams = [newUserID, req.body.employee_name, req.body.employee_title, req.body.employee_email]

        client.query(addNewUserStatement, userParams);

        // push statements to database
        await client.query('COMMIT;');
        res.status(200).json({ message: "done" });

    } catch (error) {

        // disregard if an error is caught
        await client.query('ROLLBACK;');
        throw (error);
    } finally {

        // release client back into the pool
        client.release();
    }
}