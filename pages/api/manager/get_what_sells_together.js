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

        const pairSalesQuery = `
            WITH itemPairs AS (
                SELECT
                    oi1.menu_item_id AS i1_id,
                    oi2.menu_item_id AS i2_id,
                    COUNT(*) AS freq
                FROM
                    ordered_items oi1
                JOIN
                    ordered_items oi2 ON oi1.ordered_id = oi2.ordered_id
                    AND
                    oi1.menu_item_id != oi2.menu_item_id
                JOIN
                    orders o ON oi1.ordered_id = o.order_id
                WHERE
                    o.order_date BETWEEN CAST($1 AS TIMESTAMP) AND CAST($2 AS TIMESTAMP)
                GROUP BY
                    oi1.menu_item_id,
                    oi2.menu_item_id
            )

            -- GROUP BY FREQ
            SELECT
                ip.i1_id AS i1_id,
                mi1.menu_item_name AS i1_name,
                ip.i2_id AS i2_id,
                mi2.menu_item_name AS i2_name,
                ip.freq AS frequency
            FROM
                itemPairs ip
            JOIN
                menu_items mi1 ON mi1.menu_item_id = ip.i1_id
            JOIN
                menu_items mi2 ON mi2.menu_item_id = ip.i2_id
            ORDER BY
                ip.freq DESC;
        `;

        const timeParameters = [
            req.body.start_time,
            req.body.end_time
        ];

        const result = await client.query(pairSalesQuery, timeParameters);
        const pairSalesData = result.rows; // Extract the rows from the result

        // push statements to database
        await client.query('COMMIT;');
        res.status(200).json({ message: "done", data: pairSalesData });

    } catch (error) {

        // disregard if an error is caught
        await client.query('ROLLBACK;');
        throw (error);

    } finally {

        // release client back into the pool
        client.release();

    }
}