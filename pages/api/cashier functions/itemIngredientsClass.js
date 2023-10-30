import { Pool } from 'pg';

class ItemIngredients {
    constructor() {
        this.ingredientIDs = [];
        this.quantities = [];
    }

    async GetIngredients(menuItemID) {
        const query = "SELECT ingredient_id, num_ingredients FROM menu_ingredients ORDER BY ingredient_id";

        try {
            const connection = await establishConnection();
            const statement = await connection.prepare(query);
            const resultSet = await statement.execute();

            while (resultSet.next()) {
                const data1 = resultSet.getInt("ingredient_id");
                const data2 = resultSet.getInt("num_ingredients");
                this.ingredientIDs.push(data1);
                this.quantities.push(data2);
            }

            closeConnection(connection);
        } catch (err) {
            console.log("An error has occurred.");
            console.log("See full details below.");
            console.error(err);
        }
    }
}



