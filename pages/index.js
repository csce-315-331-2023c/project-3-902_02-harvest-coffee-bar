import NavBar from './components/NavBar';
import landingStyles from './components/LandingGUIStyle.module.css';
import GenerateMenuItemPanel from './components/MenuItem';
import React, { useEffect, useState } from 'react';
import { server } from '../config';

const Index = () => {
	const [categories, setCategories] = useState([]);
	const [menuItems, setMenuItems] = useState([]);
	const [currTemperature, setCurrTemperature] = useState([]);

	useEffect(() => {
		const fetchMenuItems = async () => {
			try {
				const response = await fetch(`${server}/api/manager/get_menu`);
				if (response.ok) {
					const data = await response.json();
					//console.log(data);
					setMenuItems(data);
				} else {
					//console.error("Unable to fetch menu items.");
				}
			} catch (error) {
				//console.error('Error:', error);
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

	}, []); // called with an empty array to ensure that calls are only made once when loaded

	return (
		<div>
			<NavBar />
			<div className={landingStyles.header}>
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
