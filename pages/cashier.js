// const Cashier = () => <div>Howdy! This page is under construction</div>;
// export default Cashier;


import React, { useState } from 'react';
// import './App.css';
// import { Pool } from 'pg';
import addOrder from './api/cashier_functions/addorder.js';


const Cashier = () => {
  const [receipt, setReceipt] = useState([]);
  const [view, setView] = useState('customer');
  const [menuItems, setMenuItems] = useState([]);


    const fetchMenuItems = async () => {
      try {
        const response = await fetch('api/manager/get_menu');
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        } else {
          console.error("Unable to fetch menu items.");
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchMenuItems();

    const handleCheckout = () => {
      const customerInput = prompt('Enter Customer ID:');
      
      if (customerInput !== null) {
        // setCustomerId(customerInput);
        const orderedItemIds = receipt.map(item => item.menu_item_id);
        const totalPrice = calculateTotal();

        addOrder(totalPrice, customerInput, orderedItemIds);

        // Show a success message or perform other actions as needed
        alert('Checkout successful!');
      } else {
        // User canceled the prompt
        alert('Checkout canceled.');
      }
    };
  

  const addToReceipt = (item) => {
    setReceipt([...receipt, item]);
  };

  const removeFromReceipt = (index) => {
    const updatedReceipt = [...receipt];
    updatedReceipt.splice(index, 1);
    setReceipt(updatedReceipt);
  };

  const calculateTotal = () => {
    return receipt.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="App">
    
      <div className="menu">
      <div className="view-buttons">
        <button className={view === 'customer' ? 'active' : ''} onClick={() => setView('customer')}>
          Customer View
        </button>
        <button className={view === 'manager' ? 'active' : ''} onClick={() => setView('manager')}>
          Manager View
        </button>
      </div>

      <h2>Menu Items</h2>
        <ul>
          {menuItems.map((menuItem) => (
            <li key={menuItem.menu_item_id}>
              <button onClick={() => addToReceipt(menuItem)}>
                {menuItem.menu_item_name} - ${menuItem.price}
              </button>
            </li>
          ))}
        </ul>
    </div>
    <div className="receipt">
      <h2>Receipt</h2>
      <ul>
        {receipt.map((item, index) => (
          <li key={index}>
            <div className='receipt_item'>
              {item.menu_item_name} - ${item.price}
              <button className="remove-button" onClick={() =>
                removeFromReceipt(index)}>
                  X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className='foot'>
    <h3>Total: ${calculateTotal()}</h3>
      <button className="checkout-button" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  </div>
  );
}

export default Cashier;
