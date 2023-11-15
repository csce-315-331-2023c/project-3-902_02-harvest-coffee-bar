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

        const addInventoryItemQuery = `
            INSERT INTO
                ingredients_inventory(ingredient_id, ingredient_name, ingredient_count, max_ingredient_count)
            SELECT
                MAX(ingredient_id) + 1, $1, $2, $3
            FROM
                ingredients_inventory;
        `;

        const itemParameters = [
            req.body.ingredient_name,
            req.body.ingredient_count,
            req.body.max_ingredient_count
        ];

        client.query(addInventoryItemQuery, itemParameters);

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