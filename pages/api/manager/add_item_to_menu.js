import connection from '../../../backend/database'

export default async (req, res) => {

    if (req.method != 'POST') {
        res.status(405).send({ message: 'Invalid request: Only POST reqs allowed' });
    }

    const client = await connection.connect();

    try {

        await client.query('BEGIN;');

        const addMenuItemQuery = `
        INSERT INTO
            menu_items(menu_item_id, menu_item_name, menu_item_category, item_description, price)
        SELECT
            MAX(menu_item_id) + 1, $1, $2, $3, $4
        FROM
            menu_items;
        `;

        const itemParameters = [req.menu_item_name, req.menu_item_category, req.item_description, req.item_price];

        client.query(addMenuItemQuery, itemParameters);

    } catch (error) {

        await client.query('ROLLBACK;');
        throw (error);

    } finally {

        client.release();

    }
}