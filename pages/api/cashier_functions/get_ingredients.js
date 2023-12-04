import connection from '../../../backend/database';

export default async (req, res) => {
    // uncomment to print json req to console
    // console.log(req.body);

    // Here we handle all sql statements as a transaction so
    // can ensure that it is all handled as one unit
    // to avoid race conditions

    const client = await connection.connect();

    // push order to database
    try {
        await client.query('BEGIN;');

        const query1 = `SELECT ingredient_id FROM menu_ingredients WHERE menu_item_id = $1;`;
        // push statements to database
        const result = await client.query(query1, [req.body.menu_item_id]);
        const ingredient_ids = result.rows.map(row => row.ingredient_id);

        // joining for the query to get the names
        
        const ingredient_ids_list = ingredient_ids.join(', ');
        const query2 = `SELECT ingredient_name FROM ingredients_inventory WHERE ingredient_id IN (${ingredient_ids_list});`;
        

        // Corrected: Use await for the second query
        const result2 = await client.query(query2);

        const ingredientNames = result2.rows.map(row => row.ingredient_name);
        

        res.status(200).json(ingredientNames);
    } catch (error) {
        // disregard if an error is caught
        await client.query('ROLLBACK;');
        throw error;
    } finally {
        // release client back into the pool
        client.release();
    }
};
