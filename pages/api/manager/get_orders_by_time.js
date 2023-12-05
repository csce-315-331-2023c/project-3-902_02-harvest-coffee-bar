import connection from '../../../backend/database'

export default async (req, res) => {

    //console.log(req);
    // check if POST req
    if (req.method != 'POST') {
        res.status(405).send({ message: 'Invalid request: Only POST reqs allowed' });
    }

    // avoid race conditions
    const client = await connection.connect();

    let orderQuery;
    let orderParameters;

    try {

        await client.query('BEGIN;');

        orderParameters = [
            req.body.start_time,
            req.body.end_time + 'T23:59:59Z'
        ];

        orderQuery = `
            SELECT
                orders.order_id AS order_id,
                TO_CHAR(orders.order_date, 'YYYY-MM-DD HH24:MI:SS') AS order_date,
                orders.total_price AS total_price,
                orders.customer_id AS customer_id,
                customer.customer_name AS customer_name
            FROM
                orders
            JOIN
                customer ON orders.customer_id = customer.customer_id
            WHERE
                orders.order_date >= $1 AND orders.order_date <= $2
            ORDER BY
                orders.order_id desc;
        `;

        const result = await client.query(orderQuery, orderParameters);
        const orderData = result.rows;

        await client.query('COMMIT;');
        res.status(200).json(orderData);

    } catch (error) {

        // disregard if an error is caught
        await client.query('ROLLBACK;');
        throw (error);

    } finally {

        // release client back into the pool
        client.release();

    }
}