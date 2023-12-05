import NavBar from './components/NavBar';
import TranslationComponent from './components/TranslationComponent';
import FooterBar from './components/Footer';
import landingStyles from './components/LandingGUIStyle.module.css';
import GenerateMenuItemPanel from './components/MenuItem';
import React, { useEffect, useState } from 'react';
import { server } from '../config';

const Index = () => {
	const [menuCategories, setMenuCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [menuItems, setMenuItems] = useState([]);
	const [currTemperature, setCurrTemperature] = useState([]);
	const [accessibilityMode, setAccessibilityMode] = useState(false);

	useEffect(() => {
		const fetchMenuItems = async () => {
			try {
				const response = await fetch(`${server}/api/manager/get_menu`, { method: 'GET', headers: { 'Access-Control-Allow-Origin': `${server}` } });
				if (response.ok) {
					const data = await response.json();
					//console.log(data);
					setMenuItems(data);
				} else {
					console.error("Unable to fetch menu items.");
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};

		fetchMenuItems();

		const getTemp = async () => {
			try {
				const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=30.6013&lon=-96.3144&appid=41d12f4705a953076bb25c8e7fcb8d94&units=imperial');
				if (response.ok) {
					const data = await response.json();
					setCurrTemperature(data.main.temp);
				} else {
					console.error("Unable to fetch weather data.");
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};

		getTemp();

		const getCategories = async () => {
			try {
				const response = await fetch(`${server}/api/cashier_functions/fetch_cats`);
				if (response.ok) {
					const data = await response.json();
					setMenuCategories(data);
				}
			} catch (error) {
				console.error('Error: ', error);
			}
		}

		getCategories();


	}, []); // called with an empty array to ensure that calls are only made once when loaded

	const toggleAccessibilityMode = () => {
		setAccessibilityMode(!accessibilityMode);
	};

	return (
		<div>
			<NavBar />
			<div className={landingStyles.header}>
				<div className={landingStyles.accessibilityHeader}>
					<button onClick={toggleAccessibilityMode}>
						{accessibilityMode ? 'Disable Magnification' : 'Enable Magnification'}
					</button>
					<TranslationComponent />
				</div>
				<div className={landingStyles.headerImage}></div>
				<div className={landingStyles.headerText}>
					<h1>Welcome to</h1>
					<p>Harvest Coffee Bar</p>
				</div>
			</div>

			<div className={landingStyles.weather}>
				<p>It is currently {currTemperature}&deg;F, come have a {currTemperature > 85 ? 'iced tea!' : 'hot coffee!'}</p>
				<p1>or check out our other options...</p1>
			</div>
			<div className={landingStyles.category}>
				<ul>
					{menuCategories.map((category) => (
						<div>
							<div className={landingStyles.categoryHeader}>
								<h1> {category.menu_item_category} </h1>
							</div>
							<hr className={landingStyles.line}></hr>
							<div className={landingStyles.items}>
								<ul>
									{menuItems.filter((menuItem) =>
										menuItem.menu_item_category === category.menu_item_category).map((menuItem) => (
											<GenerateMenuItemPanel item={menuItem} mode={accessibilityMode} />
										))}
								</ul>
							</div>
						</div>
					))}
				</ul>
			</div>

			<FooterBar />
		</div>
	);
}

export default Index;
