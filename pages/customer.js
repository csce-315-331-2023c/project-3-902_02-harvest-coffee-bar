import React, { useEffect, useState } from 'react';
import styles from './components/CustomerGUIStyle.module.css';
import { server } from '../config';
import Link from 'next/link';
import NavBar from './components/NavBar.js'

const Customer = () => {
	const [receipt, setReceipt] = useState([]);
	const [view, setView] = useState('customer');
	const [menuItems, setMenuItems] = useState([]);
	const [menuCats, setMenuCats] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [accessibilityMode, setAccessibilityMode] = useState(false);
	const [showIngredientsModal, setShowIngredientsModal] = useState(false);
	const [selectedIngredients, setSelectedIngredients] = useState([]);
	const [selectedMenuItem, setSelectedMenuItem] = useState(null);


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

	const displayCat = (category) => {
		setSelectedCategory(category);
	}

	const filteredMenuItems = selectedCategory ? menuItems.filter((menuItem) =>
		menuItem.menu_item_category === selectedCategory) : [];

	useEffect(() => {
		fetchMenuItems();
		get_categories();
	}, []);


	const addToReceipt = (item) => {
		setReceipt([...receipt, item]);
		closeIngredientsModal();
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

		const customerID = prompt("Please enter the customer ID");
		const tip = prompt("Please enter a tip")
		var payload = {
			total_price: calculateTotal() - calculateTotal() + tip,
			order_date: new Date().toISOString().split('.')[0],
			ordered_items: receipt,
			customer_id: customerID
		}
		await fetch(`${server}/api/cashier_functions/add_order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
		setReceipt([]);
	}

	const displayIngredients = async (menuItem) => {
		setSelectedMenuItem(menuItem);
		var payload = {
			menu_item_id: menuItem.menu_item_id
		}
		try {
			console.log(menuItem.menu_item_id);
			const response = await fetch(`${server}/api/cashier_functions/get_ingredients`,
				{ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
			console.log(response);
			if (response.ok) {
				const data = await response.json();
				setSelectedIngredients(data); // Save ingredients to state
				setShowIngredientsModal(true); // Show the modal
			}
		} catch (error) {
			console.error('Error: ', error);
		}

	}

	const removeIngredient = (index) => {
		const updatedIngredients = [...selectedIngredients];
		updatedIngredients.splice(index, 1);
		setSelectedIngredients(updatedIngredients);
	};

	const toggleAccessibilityMode = () => {
		setAccessibilityMode(!accessibilityMode);
	};

	const closeIngredientsModal = () => {
		setShowIngredientsModal(false);
		setSelectedIngredients([]);
	};

	return (
		<div className={`${styles.CustomerGUI} ${accessibilityMode ? styles.accessibilityMode : ''}`}>
			<NavBar />

			<div className={styles.mainScreen}>
				<div className={styles.menu}>
					<div className={styles.header2}>
						<h2>Order Online</h2>
						<button onClick={toggleAccessibilityMode}>
							{accessibilityMode ? 'Disable Accessibilty Mode' : 'Enable Accessibility Mode'}
						</button>
					</div>
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
					<h2>{selectedCategory}</h2>
					{showIngredientsModal && selectedMenuItem && (
						<div>
							<div className={styles.overlay}></div>
							<div className={styles.modal}>
								<div className={styles.modalContent}>
									<h2>Ingredients for {selectedMenuItem.menu_item_name}</h2>
									<ul>
										{selectedIngredients.map((ingredient, index) => (
											<li key={index}>
												{ingredient}
												<button className={styles.removeIngredientButton} onClick={() => removeIngredient(index)}>
													Remove
												</button>
											</li>
										))}
									</ul>
									<button className={styles.addToReceiptButton} onClick={() => addToReceipt(selectedMenuItem)}>
										Add to Receipt
									</button>
								</div>
							</div>
						</div>
					)}
					<div className={styles.menuItemStyle}>
						<ul>
							{filteredMenuItems.map((menuItem) => (
								<li key={menuItem.menu_item_id}>
									<button className={styles.itemButtons} onClick={() => displayIngredients(menuItem)}>
										<div className={styles.itemNameStyle}>
											{menuItem.menu_item_name} - ${menuItem.price}
										</div>
										{menuItem.item_description}
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
			<div className={styles.footer}>
				<hr className={styles.line2}></hr>
				<h3>Hours</h3>
				<br></br>
				<pre>
					{'                          Open Daily from 7am - 6pm\n1037 University Dr - Suite 109, College Station, TX 77840\n                                    (979) 599-3236'}
				</pre>


			</div>
		</div>
	);
}

export default Customer;
