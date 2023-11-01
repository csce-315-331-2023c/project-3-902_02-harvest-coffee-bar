import { Pool } from 'pg';
import UpdateIngredients from './updateIngredients.js';

async function AddOrderedItem(connection, order_id, menu_item_id) {
    const insertOrderedItem = `
        INSERT INTO
            ordered_items(ordered_id, menu_item_id, num_items)
        VALUES
            ($1, $2, 1)
    `;

    try {
        const preppedCommand = await connection.prepare(insertOrderedItem);
        
        // Add values to the command
        await preppedCommand.setInt(1, order_id);
        await preppedCommand.setInt(2, menu_item_id);

        // Execute the command
        await preppedCommand.execute();

        // Assuming you have an updateIngredients function, call it here
        await UpdateIngredients(connection, menu_item_id);

    } catch (err) {
        console.log("An error has occurred.");
        console.log("See full details below.");
        console.error(err);
    }
} export { AddOrderedItem };