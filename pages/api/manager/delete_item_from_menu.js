import connection from '../../../backend/database'

export default async (req, res) => {

    if (req.method != 'POST') {
        res.status(405).send({ message: 'Invalid request: Only POST reqs allowed' });
    }

    const client = await connection.connect();

    try {

        await client.query('BEGIN;');

        const deleteItemFromMenuQuery = `
        DELETE FROM
            menu_items
        WHERE
            menu_item_id = ?;
        `;

        const itemParameter = [req.menu_item_id];

        client.query(deleteItemFromMenuQuery, itemParameter);

    } catch (error) {

        await client.query('ROLLBACK;');
        throw (error);

    } finally {

        client.release();

    }
}