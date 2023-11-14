import connection from '../../../backend/database'

export default async (req, res) => {

    // check if POST req
    if (req.method != 'POST') {
        res.status(405).send({ message: 'Invalid request: Only POST reqs allowed' });
    }

    // avoid race conditions
    const client = await connection.connect();

    // add item to menu
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

        const itemParameters = [
            req.menu_item_name,
            req.menu_item_category,
            req.item_description,
            req.price
        ];

        client.query(addMenuItemQuery, itemParameters);

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