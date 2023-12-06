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

        const orderParameters = [
            req.body.order_id
        ];

        const deleteOrderItemsQuery = `
            DELETE FROM
                ordered_items
            WHERE
                ordered_id = $1;
        `;

        const deleteOrderQuery = `
            DELETE FROM
                orders
            WHERE
                order_id = $1;
        `

        client.query(deleteOrderItemsQuery, orderParameters);
        client.query(deleteOrderQuery, orderParameters);

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