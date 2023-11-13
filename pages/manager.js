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

    const addItemToMenu = async () => {
    
        // TODO: ADD PARAMETERS FROM INPUT
        var payload = {
            menu_item_name: "",
            menu_item_category: "",
            item_description: "",
            price: 0.0
        }

        await fetch(`${server}/api/manager/add_item_to_menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }

    const deleteItemFromMenu = async () => {

        // TODO: ADD PARAMETERS FROM INPUT
        var payload = {
            menu_item_id: -1
        }

        await fetch(`${server}/api/manager/delete_item_from_menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const editMenuItem = async () => {

        // TODO: ADD PARAMETERS FROM INPUT
        var payload = {
            price: 0.0,
            menu_item_id: -1
        }

        await fetch(`${server}/api/manager/edit_menu_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const addIngredientsToMenuItem = async () => {

        // TODO: ADD PARAMETERS FROM INPUT
        var payload = {
            menu_item_id: -1, 
            ingredient_id: -1, 
            num_ingredients: -1
        }

        await fetch(`${server}/api/manager/add_ingredients_in_menu_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const viewAllInInventory = async () => {

        const response = await fetch(`${server}/api/manager/view_all_in_inventory`, { method: 'POST', headers: { 'Content-Type': 'application/json' }});

    }

    const updateItemInInventory = async () => {

        // TODO: ADD PARAMETERS FROM INPUT
        var payload = {
            ingredient_count: 0, 
            ingredient_id: -1
        }

        await fetch(`${server}/api/manager/update_inventory_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const addInventoryItem = async () => {

        // TODO: ADD PARAMETERS FROM INPUT
        var payload = {
            ingredient_name: "",
            ingredient_count: 0,
            max_ingredient_count: 0
        }

        await fetch(`${server}/api/manager/add_inventory_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const deleteInventoryItem = async () => {

        // TODO: ADD PARAMETERS FROM INPUT
        var payload = {
            ingredient_id: -1
        }

        await fetch(`${server}/api/manager/delete_inventory_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

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