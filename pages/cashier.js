import React, { useState } from 'react';
import styles from './components/CashierGUIStyle.module.css'
import { server } from '../config';

const Cashier = () => {
	const [receipt, setReceipt] = useState([]);
	const [view, setView] = useState('customer');
	const [menuItems, setMenuItems] = useState([]);

	const fetchMenuItems = async () => {
		try {
			const response = await fetch(`${server}/api/manager/get_menu`);
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
		<div className={styles.CashierGUI}>

			<div className="view-buttons">
				<button className={view === 'customer' ? 'active' : ''} onClick={() => setView('customer')}>
					Customer View
				</button>
				<button className={view === 'manager' ? 'active' : ''} onClick={() => setView('manager')}>
					Manager View
				</button>
			</div>

			<div className={styles.mainScreen}>
				<div className={styles.menu}>

					<h2>Menu Items</h2>
					<ul>
						{menuItems.map((menuItem) => (
							<li key={menuItem.menu_item_id}>
								<button className={styles.itemButtons} onClick={() => addToReceipt(menuItem)}>
									{menuItem.menu_item_name} - ${menuItem.price}
								</button>
							</li>
						))}
					</ul>
				</div>
				<div className={styles.receipt}>
					<div>
						<h2>Receipt</h2>
						<ul>
							{receipt.map((item, index) => (
								<li key={index}>
									<div className={styles.receiptItems}>
										{item.menu_item_name} - ${item.price}
										<button className={styles.removeButton} onClick={() =>
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
						<button className={styles.checkoutButton} onClick={() => alert('Checkout successful!')}>
							Checkout
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Cashier;
