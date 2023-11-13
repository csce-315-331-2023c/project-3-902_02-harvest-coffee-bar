import React, { useState, useEffect } from 'react';
import styles from './components/CashierGUIStyle.module.css';
import { server } from '../config';
import NavBar from './components/NavBar.js'

const Cashier = () => {
	const [receipt, setReceipt] = useState([]);
	const [view, setView] = useState('customer');
	const [menuItems, setMenuItems] = useState([]);
	const [menuCats, setMenuCats] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
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

		const get_categories = async () => {
			try {
				const response = await fetch(`${server}/api/cashier_functions/fetch_cats`);
				if (response.ok) {
					const data = await response.json();
					setMenuCats(data);
				}
			} catch (error) {
				console.error('Error: ', error);
			}
		}

		fetchMenuItems();
		get_categories();

	}, []);

	const displayCat = (category) => {
		setSelectedCategory(category);
	}

	const filteredMenuItems = selectedCategory ? menuItems.filter((menuItem) =>
		menuItem.menu_item_category === selectedCategory) : [];

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

	const handleCheckout = async () => {

		var payload = {
			total_price: calculateTotal(),
			order_date: new Date().toISOString().split('.')[0],
			ordered_items: receipt
		}

		await fetch(`${server}/api/cashier_functions/add_order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
		setReceipt([]);
	}



	return (
		<div className={styles.CashierGUI}>

			<NavBar />
			<div className={styles.mainScreen}>
				<div className={styles.menu}>
					<h2>Place Orders</h2>
					<div className={styles.catStyle}>
						<ul>
							{menuCats.map((menuCat) => (
								<button key={menuCat.menu_item_category}
									className={styles.catButtons}
									onClick={() => displayCat(menuCat.menu_item_category)}>
									<p>{menuCat.menu_item_category}</p>
								</button>
							))}
						</ul>
					</div>
					<hr className={styles.line}></hr>
					<h2>Menu Items</h2>
					<div className={styles.menuItemStyle}>
						<ul>
							{filteredMenuItems.map((menuItem) => (
								<li key={menuItem.menu_item_id}>
									<button className={styles.itemButtons} onClick={() => addToReceipt(menuItem)}>
										{menuItem.menu_item_name} - ${menuItem.price}
									</button>
								</li>
							))}
						</ul>
					</div>
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
					<div className={styles.foot}>
						<h3>Total: ${calculateTotal()}</h3>
						<button className={styles.checkoutButton} onClick={() => handleCheckout()}>
							Checkout
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Cashier;
