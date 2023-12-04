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

        const lowStockQuery = `
            SELECT
                ingredient_name,
                ingredient_count
            FROM
                ingredients_inventory
            WHERE
                ingredient_count <= max_ingredient_count/5
            ORDER BY
                ingredient_count asc;
        `;

        const result = await client.query(lowStockQuery);
        const lowStockData = result.rows; // Extract the rows from the result

        // push statements to database
        await client.query('COMMIT;');
        res.status(200).json({ message: "done", data: lowStockData });

    } catch (error) {

        // disregard if an error is caught
        await client.query('ROLLBACK;');
        throw (error);

    } finally {

        // release client back into the pool
        client.release();

    }
}