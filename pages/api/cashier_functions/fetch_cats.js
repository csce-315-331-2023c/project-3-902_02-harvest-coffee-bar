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

        const selectCategories = await connection.query(`SELECT DISTINCT menu_item_category FROM menu_items;`);

        // push statements to database
        await client.query('COMMIT;');
        res.status(200).json(selectCategories.rows);

    } catch (error) {

        // disregard if an error is caught
        await client.query('ROLLBACK;');
        throw (error);
    } finally {

        // release client back into the pool
        client.release();
    }
}