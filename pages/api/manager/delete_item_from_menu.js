//
// TO BE DELETED
//


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

        const deleteItemFromMenuQuery = `
            DELETE FROM
                menu_items
            WHERE
                menu_item_id = $1;
        `;

        const itemParameter = [
            req.body.menu_item_id
        ];

        client.query(deleteItemFromMenuQuery, itemParameter);

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