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

        const toogleIsActiveQuery = `
            UPDATE
                menu_items
            SET
                is_active = $1
            WHERE
                menu_item_id = $2;
        `;

        const itemParameter = [
            req.body.is_active,
            req.body.menu_item_id
        ];

        client.query(toogleIsActiveQuery, itemParameter);

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