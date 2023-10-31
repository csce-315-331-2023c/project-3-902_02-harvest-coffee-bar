import React, { useState } from 'react';
// import './cashier.css';

const MENU_ITEMS = [
  { id: 1, name: 'Item 1', price: 5 },
  { id: 2, name: 'Item 2', price: 8 },
  { id: 3, name: 'Item 3', price: 10 },
];

const cashier = () => {
  const [receipt, setReceipt] = useState([]);
  const [view, setView] = useState('customer');
  
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
    <div className="cashier">
    
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
        {MENU_ITEMS.map((item) => (
          <li key={item.id}> 
          <button onClick={() => addToReceipt(item)}>
            {item.name} - ${item.price}
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
              {item.name} - ${item.price}
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
      <button className="checkout-button" onClick={() => alert('Checkout successful!')}>
        Checkout
      </button>
    </div>
  </div>
  );
}

export default cashier;
