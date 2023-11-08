import NavBar from './components/NavBar';
import landingStyles from './components/LandingGUIStyle.module.css';
import GenerateMenuItemPanel from './components/MenuItem';
import React, { useState } from 'react';
import { server } from '../config';

const Index = () => {
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

	return (
		<div>
			<NavBar />
			<div className={landingStyles.header}>
				<h1>Welcome to</h1>
				<p>Harvest Coffee Bar</p>
			</div>

			<div className={landingStyles.menu}>
				<ul>
					{menuItems.map((menuItem) => (
						<GenerateMenuItemPanel item={menuItem} />
					))}
				</ul>
			</div>
		</div>
	);
}

export default Index;
