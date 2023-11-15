import connection from '../../../backend/database'

export default async (req, res) => {

    // check if POST req
    if (req.method != 'POST') {
        res.status(405).send({ message: 'Invalid request: Only POST reqs allowed' });
    }

    // avoid race conditions
    const client = await connection.connect();

    let salesQuery;
    let salesParameters;

    //console.log(req);
    // add item to menu
    try {

        await client.query('BEGIN;');

        if (req.body.item_name !== null && req.body.item_name !== 'All') {

            salesParameters = [
                req.body.start_time,
                req.body.end_time,
                req.body.item_name
            ];

            salesQuery = `
                SELECT
                    menu_items.menu_item_name as item,
                    SUM(ordered_items.num_items) as total_sales,
                    SUM(ordered_items.num_items * menu_items.price) as total_profit
                FROM
                    orders
                JOIN
                    ordered_items ON orders.order_id = ordered_items.ordered_id
                JOIN
                    menu_items ON ordered_items.menu_item_id = menu_items.menu_item_id
                WHERE
                    orders.order_date BETWEEN $1 AND $2
                    AND menu_items.menu_item_name = $3
                GROUP BY
                    menu_items.menu_item_name
                ORDER BY
                    total_sales DESC;
            `;

        } else {
            salesParameters = [
                req.body.start_time,
                req.body.end_time
            ];

            salesQuery = `
                SELECT
                    menu_items.menu_item_name as item,
                    SUM(ordered_items.num_items) as total_sales,
                    SUM(ordered_items.num_items * menu_items.price) as total_profit
                FROM
                    orders
                JOIN
                    ordered_items ON orders.order_id = ordered_items.ordered_id
                JOIN
                    menu_items ON ordered_items.menu_item_id = menu_items.menu_item_id
                WHERE
                    orders.order_date BETWEEN $1 AND $2
                GROUP BY
                    menu_items.menu_item_name
                ORDER BY
                    total_sales DESC;
            `;
        }

        const result = await client.query(salesQuery, salesParameters);
        const salesData = result.rows; // Extract the rows from the result

        // push statements to database
        await client.query('COMMIT;');
        res.status(200).json(salesData);

    } catch (error) {

        // disregard if an error is caught
        await client.query('ROLLBACK;');
        throw (error);

    } finally {

        // release client back into the pool
        client.release();

    }
}