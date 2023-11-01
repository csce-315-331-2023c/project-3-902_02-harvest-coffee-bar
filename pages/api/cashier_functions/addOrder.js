import { Pool } from 'pg';
import AddOrderedItem from './addOrderedItem.js';
import GetOrderNumber from './getOrderNumber.js';
import connection from '../../../backend/database.js'


async function addOrders(total_price, customer_id, menu_item_ids) {
    const order_id = await GetOrderNumber(connection);
    const currDateTime = new Date(); // Get the current date and time

    // Prepare SQL query
    const addOrder = `
        INSERT INTO
            orders(order_id, order_type, total_price, order_date, customer_id)
        VALUES
            ($1, $2, $3, $4, $5)
    `;

    try {
        const preparedStatement = await connection.prepare(addOrder);
        await preparedStatement.setInt(1, order_id);
        await preparedStatement.setString(2, 'Dine-In'); // Set the order type
        await preparedStatement.setFloat(3, total_price); // Set the total price
        await preparedStatement.setObject(4, currDateTime); // Set the order date as a Date object
        await preparedStatement.setInt(5, customer_id); // Set the customer ID

        // Execute the SQL statement
        await preparedStatement.execute();

        // Close the PreparedStatement
        await preparedStatement.close();
    } catch (err) {
        console.log('An error has occurred.');
        console.log('See full details below.');
        console.error(err);
    }

    // Loop to add items to ordered items
    for (let i = 0; i < menu_item_ids.length; i++) {
        await AddOrderedItem(connection, order_id, menu_item_ids[i]);
    }
}
export { addOrders };