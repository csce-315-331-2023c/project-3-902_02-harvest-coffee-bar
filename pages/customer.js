import React, { useEffect, useState } from 'react';
import styles from './components/CustomerGUIStyle.module.css';
import { server } from '../config';
import Link from 'next/link';

const Customer = () => {
	const [receipt, setReceipt] = useState([]);
	const [view, setView] = useState('customer');
	const [menuItems, setMenuItems] = useState([]);
	const [menuCats, setMenuCats] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [receiptVisible, setReceiptVisible] = useState(false);

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
	get_categories(); }, []);


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

		const customerID = prompt("Please enter the customer ID");
		const tip = prompt("Please enter a tip")
		var payload = {
			total_price: calculateTotal() + tip,
			order_date: new Date().toISOString().split('.')[0],
			ordered_items: receipt,
			cusomter_id: customerID
		}

		await fetch(`${server}/api/cashier_functions/add_order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setReceipt([]);
	}

	// useEffect(() => {
	// 	document.body.style.overflow = "hidden";
	// 	return () => {
	// 		document.body.style.overflow = "scroll"
	// 	};
	// }, []);

	const ReceiptPopup = () => {
        // Close the receipt popup by setting the state to false
        setReceiptVisible(!receiptVisible);
    };

	return (
		<div className={styles.CustomerGUI}>
            <div className={styles.header}>
                <ul className={styles.links}>
				    <li><Link href="/customer"><a className={styles.orderButton}>Order Online</a></Link></li>
				    <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
				    <li><Link href="/manager"><a>Manager Page</a></Link></li>
			    </ul>
                <button className={styles.checkout} onClick={ReceiptPopup}>Checkout</button>
				{ receiptVisible && (
					<div className={styles.overlay}>
                    	<div className={styles.popup}>
							<div className={styles.receipt}>
								<div>
									<h2>Receipt</h2>
									<hr className={styles.line}></hr>
									<button className={styles.closebtn} onClick={ReceiptPopup}>X</button>
									<ul>
										{receipt.map((item, index) => (
											<li key={index}>
												<div className={styles.receiptItems}>
													{item.menu_item_name} - ${item.price}
													<button className={styles.removeButton} onClick={() => removeFromReceipt(index)}>
														X
													</button>
												</div>
											</li>
										))}
									</ul>
								</div>
							</div>
							<div className={styles.foot}>
								<h3 className={styles.total}>Total: ${calculateTotal()}</h3>
								<button className={styles.checkoutButton} onClick={handleCheckout}>
									Place Order
								</button>
							</div>
                    	</div>
					</div>
				)}
            </div>


			<div className={styles.mainScreen}>
				<div className={styles.menu}>
					<h2>Order Online</h2>
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
					<div className={styles.menuItemStyle}>
						<ul>
							{filteredMenuItems.map((menuItem) => (
								<li key={menuItem.menu_item_id}>
									<button className={styles.itemButtons} onClick={() => addToReceipt(menuItem)}>
										{menuItem.menu_item_name} - ${menuItem.price} {menuItem.item_description}
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Customer;
