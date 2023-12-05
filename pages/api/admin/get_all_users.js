import connection from '../../../backend/database'

export default async (req, res) => {

    try {
        // Fetch orders from your database
        const allUsers = await connection.query(`
        SELECT 
            * 
        FROM 
            employees 
        ORDER BY 
            employee_title, employee_id`);

        // Respond with the orders data
        res.status(200).json(allUsers.rows);

    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch menu items' });
    }
}