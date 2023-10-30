import connection from '../backend/database'

export const getInventory = async () => {
    const client = await connection.client()
    const result = await client.query('SELECT * FROM orders')
    client.release()

    console.log(result)
}

const Manager = () => (
    getInventory()
    //<div>Howdy! This page is under construction</div>
)

export default Manager;