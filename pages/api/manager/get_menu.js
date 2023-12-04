import connection from '../../../backend/database'

export default async (req, res) => {

    try {
        // Fetch orders from your database
        const menuItems = await connection.query(
            `SELECT * FROM menu_items
            WHERE is_active = true
            ORDER BY menu_item_category, menu_item_id`
        );

        // Respond with the orders data
        res.status(200).json(menuItems.rows);

    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch menu items' });
    }
}