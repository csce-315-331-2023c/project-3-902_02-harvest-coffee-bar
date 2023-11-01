import connection from '../../../backend/database'

export default async (req, res) => {

    if (req.method != 'POST') {
        res.status(405).send({ message: 'Invalid request: Only POST reqs allowed' });
        return;
    }

    // console.log('Request Recieved');
    // (req.body).forEach(element => {
    //     console.log(element.menu_item_name)
    // });

    console.log(req.body);

    //push order to database
    try {

        const query = await connection.query("SELECT MAX(order_id) + 1 as new_id FROM orders");
        const newOrderID = query.rows[0].new_id;

        //push order to database
        const orderStatement = `
                INSERT INTO
                    orders(order_id, order_type, total_price, order_date, customer_id)
                SELECT
                    $1, 'Dine-In', $2, $3, 777
                FROM
                    orders
                `;
        const orderParams = [newOrderID, req.body.total_price, req.body.order_date]

        connection.query(orderStatement, orderParams);

        const orderedItemStatement = `
                INSERT INTO
                    ordered_items(ordered_id, menu_item_id, num_items)
                VALUES
                    ($1, $2, $3)
        `
        //associate items to order
        req.body.ordered_items.forEach(element => {
            orderedItemParams = [newOrderID, element.menu_item_id, 1]
            connection.query(orderedItemStatement, orderedItemParams);

            console.log("Pushed item to order");
        });

        res.status(200).json({ message: "done" });

    } catch (error) {
        res.status(500).json({ error: 'Unable to push order' });

    }
}