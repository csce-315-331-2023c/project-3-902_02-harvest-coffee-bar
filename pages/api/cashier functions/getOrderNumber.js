import { Pool } from 'pg';

async function getOrderNumber(connection) {
    const query = `
        SELECT order_id FROM orders
        ORDER BY order_id DESC
        LIMIT 1
    `;

    try {
        const preppedCommand = await connection.prepare(query);
        const resultSet = await preppedCommand.execute();

        // Check if there's a result
        if (resultSet.next()) {
            const id = resultSet.getInt("order_id") + 1;
            return id;
        } else {
            console.log("No entries in the table.");
        }
    } catch (err) {
        console.log("An error has occurred.");
        console.log("See full details below.");
        console.error(err);
    }

    return -1;
}