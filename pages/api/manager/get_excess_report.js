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

        excessQuery = `
            SELECT
                ii.ingredient_id,
                ii.ingredient_name,
                SUM(CASE WHEN o.order_date >= $1 THEN oi.num_items ELSE 0 END) AS total_items_sold,
                ii.ingredient_count AS current_ingredient_amount
            FROM
                public.ingredients_inventory ii
            LEFT JOIN
                public.ordered_items oi ON ii.ingredient_id = oi.menu_item_id
            LEFT JOIN
                public.orders o ON oi.ordered_id = o.order_id
            WHERE
                o.order_date >= $2
            GROUP BY
                ii.ingredient_id, ii.ingredient_name, ii.ingredient_count
            HAVING
                SUM(CASE WHEN o.order_date >= $3 THEN oi.num_items ELSE 0 END) <
                0.1 * (SUM(CASE WHEN o.order_date >= $4 THEN oi.num_items ELSE 0 END) + ii.ingredient_count)
            ORDER BY
                total_items_sold;
        `;

        reportParameters = [
            req.body.start_date,
            req.body.start_date,
            req.body.start_date,
            req.body.start_date
        ];

        const result = await client.query(excessQuery, reportParameters);
        const excessReport = result.rows; // Extract the rows from the result

        // push statements to database
        await client.query('COMMIT;');
        res.status(200).json({ message: "done", data: excessReport });

    } catch (error) {

        // disregard if an error is caught
        await client.query('ROLLBACK;');
        throw (error);

    } finally {

        // release client back into the pool
        client.release();

    }
}