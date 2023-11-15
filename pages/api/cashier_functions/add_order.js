import connection from '../../../backend/database'

export default async (req, res) => {

    // check if POST req
    if (req.method != 'POST') {
        res.status(405).send({ message: 'Invalid request: Only POST reqs allowed' });
        return;
    }

    // uncomment to print json req to console
    // console.log(req.body);

    // Here we handle all sql statements as a transaction so 
    // can ensure that it is all handled as one unit
    // to avoid race conditions

    const client = await connection.connect();

    //push order to database
    try {

        await client.query('BEGIN;');

        // grab new order id
        const newIdQuery = await connection.query("SELECT MAX(order_id) + 1 as new_id FROM orders;");
        const newOrderID = newIdQuery.rows[0].new_id;

        // push order to database
        const insertOrderStatement = `
                INSERT INTO
                    orders(order_id, order_type, total_price, order_date, customer_id)
                VALUES 
                    ($1, 'Dine-In', $2, $3, $4);
                `;

        const orderParams = [newOrderID, req.body.total_price, req.body.order_date, req.body.customer_id]

        client.query(insertOrderStatement, orderParams);

        // associate items to an order
        const orderedItemStatement = `
                INSERT INTO
                    ordered_items(ordered_id, menu_item_id, num_items)
                VALUES
                    ($1, $2, $3);
        `;

        for (let i = 0; i < req.body.ordered_items.length; ++i) {
            const orderedItemParams = [newOrderID, req.body.ordered_items[i].menu_item_id, 1];
            client.query(orderedItemStatement, orderedItemParams);
        }

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