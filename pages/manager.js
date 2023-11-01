// pages/manager.js

import { useState } from 'react';
import { server } from '../config';

function manager() {
    const [menuItems, setMenuItems] = useState([]);

    const fetchMenuItems = async () => {
        try {

            //attempt to fetch menu items
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

    return (
        <div>
            <h1>Menu Items</h1>
            <button onClick={fetchMenuItems}>Fetch Menu Items</button>
            <ul>
                {menuItems.map((menuItems) => (
                    <li key={menuItems.menu_item_id}>
                        Item ID: {menuItems.menu_item_id}, Item Name: {menuItems.menu_item_name}
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default manager;