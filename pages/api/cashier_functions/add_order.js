import connection from '../../../backend/database'

export default async (req, res) => {

    if (req.method != 'POST') {
        res.status(405).send({ message: 'Invalid request: Only POST reqs allowed' });
        return;
    }

    console.log('Request Recieved');
    (req.body).forEach(element => {
        console.log(element.menu_item_name)
    });
    res.status(200).send({ message: 'Request Recieved' });

    //push order to database
    // try {
    //     const statement = `
    //             INSERT INTO
    //                 orders(order_id, order_type, total_price, order_date, customer_id)
    //             SELECT
    //                 MAX(order_id) + 1, Dine-In, $1, $2, $3
    //             FROM
    //                 orders
    //             `;

    // }

    //associate items to order


}