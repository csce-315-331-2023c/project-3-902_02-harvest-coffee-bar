import connection from '../../backend/database'

export default async (req, res) => {

    try {
        // Fetch orders from your database
        const orders = await connection.query('SELECT * FROM menu_items');

        // Respond with the orders data
        res.status(200).json(orders.rows);

    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch orders' });
    }
}