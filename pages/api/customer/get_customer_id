// pages/api/get_customer_id.js
import connection from '../../backend/database';

export default async function handler(req, res) {
  const { email } = req.body;

  try {
    // Try to find the customer in the database
    const { rows } = await connection.query('SELECT customer_id FROM customer WHERE customer_email = $1', [email]);
    let customerId;

    if (rows.length > 0) {
      // If the customer exists, get the id
      customerId = rows[0].customer_id;
    } else {
      // If the customer doesn't exist, create a new one
      const result = await connection.query('INSERT INTO customer(customer_email) VALUES($1) RETURNING customer_id', [email]);
      customerId = result.rows[0].customer_id;
    }

    // Return the customer id
    res.status(200).json({ id: customerId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}