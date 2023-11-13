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

        const fetchInventoryQuery = `
        SELECT
            *
        FROM
            ingredients_inventory
        ORDER BY
            ingredient_id
        `;

        const result = await client.query(fetchInventoryQuery);
        const inventoryData = result.rows; // Extract the rows from the result

        // push statements to database
        await client.query('COMMIT;');
        res.status(200).json({ message: "done", data: inventoryData });

    } catch (error) {

        // disregard if an error is caught
        await client.query('ROLLBACK;');
        throw (error);

    } finally {

        // release client back into the pool
        client.release();

    }
}