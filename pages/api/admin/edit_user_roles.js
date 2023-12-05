import connection from '../../../backend/database'

export default async (req, res) => {

    // check if POST req
    if (req.method != 'POST') {
        res.status(405).send({ message: 'Invalid request: Only POST reqs allowed' });
    }

    // avoid race conditions
    const client = await connection.connect();

    // delete item from menu
    try {

        await client.query('BEGIN;');

        const editUserRoleQuery = `
            UPDATE
                employees
            SET
                employee_title = $1
            WHERE
                employee_email = $2;
        `;

        const editParams = [
            req.body.employee_role,
            req.body.employee_email
        ];

        client.query(editUserRoleQuery, editParams);

        // push statements to database
        await client.query('COMMIT;');
        res.status(200).json({ message: "done" });

    } catch (error) {

        // disregard if error is caught
        await client.query('ROLLBACK;');
        throw (error);

    } finally {

        // release client back into pool
        client.release();

    }
}