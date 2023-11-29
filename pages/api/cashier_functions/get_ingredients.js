import connection from '../../../backend/database'

export default async (req, res) => {

    // uncomment to print json req to console
    // console.log(req.body);

    // Here we handle all sql statements as a transaction so 
    // can ensure that it is all handled as one unit
    // to avoid race conditions
    
    const client = await connection.connect();

    //push order to database
    try {

        await client.query('BEGIN;');
        const menu_item = req.body.menu_item_id;

        const query1 = `SELECT ingredient_id FROM menu_ingredients WHERE menu_item_id = ${menu_item};`;

        // push statements to database
        await client.query(query1,(error, results1) => {
            const ingredient_ids = results1.map(result => result.ingredient_id);
            // joining for the query to get the names
            const ingredient_ids_list = ingredient_ids.join(', ');
            const query2 = `SELECT ingredient_name FROM ingredients_inventory WHERE ingredient_id IN (${ingredient_ids_list});`;

            connection.query(query2, (error, results2) => {
                if (error) throw error;
            
                const ingredientNames = results2.map(result => result.ingredient_name);
            
                res.status(200).json(ingredientNames.rows);
                connection.end();
            });
        });

    } catch (error) {

        // disregard if an error is caught
        await client.query('ROLLBACK;');
        throw (error);
    } finally {

        // release client back into the pool
        client.release();
    }
}