import { Pool } from 'pg';
import ItemIngredients from './itemIngredientsClass.js';

async function UpdateIngredients(connection, menuItemID) {
    currItems = new ItemIngredients();
    currItems.GetIngredients(connection, menuItemID);

    for (let i = 0; i < currItems.ingredientIDs.size(); i++) {
        idToChange = currItems.ingredientIDs[i];
        quantityToChange = currItems.quantities[i];

        query = `
            UPDATE ingredients_inventory
            SET ingredient_count = ingredient_count - ?
            WHERE ingredient_id = ?
        `;

        try {
            const preppedCommand = await connection.prepare(query);
            
            // Add values to the prepared command
            await preppedCommand.setInt(1, quantity_to_change);
            await preppedCommand.setInt(2, id_to_change);
    
            // Execute the command
            await preppedCommand.execute();
        } catch (err) {
            console.log("An error has occurred.");
            console.log("See full details below.");
            console.error(err);
        }
    }

    currItems.ingredientIDs = [];
    currItems.quantities = [];
} export { UpdateIngredients }