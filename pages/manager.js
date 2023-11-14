// pages/manager.js

import { useState } from 'react';
import { server } from '../config';
import Link from 'next/link';
import navStyles from './components/NavBar.module.css';
import managerStyles from './components/ManagerGUIStyle.module.css'

function Manager() {
    const [menuItems, setMenuItems] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedItem, setSelectedItem] = useState('All');
    const [inventoryItems, setInventoryItems] = useState([]);
    const [excessReports, setExcessReports] = useState([]);
    const [employeeSchedules, setEmployeeSchedules] = useState([]);

    const [isMenuVisible, setIsMenuVisible] = useState(false); 
    const toggleMenuVisibility = () => {
        setIsMenuVisible(!isMenuVisible); 
    };

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

    const addItemToMenu = async (menu_item_name, menu_item_category, item_description, price) => {
    
        var payload = {
            menu_item_name: menu_item_name,
            menu_item_category: menu_item_category,
            item_description: item_description,
            price: price
        }

        await fetch(`${server}/api/manager/add_item_to_menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const deleteItemFromMenu = async (menu_item_id) => {

        var payload = {
            menu_item_id: menu_item_id
        }

        await fetch(`${server}/api/manager/delete_item_from_menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }

    const editMenuItem = async (price, menu_item_id) => {

        var payload = {
            price: price,
            menu_item_id: menu_item_id
        }

        await fetch(`${server}/api/manager/edit_menu_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const addIngredientsToMenuItem = async (menu_item_id, ingredient_id, num_ingredients) => {

        var payload = {
            menu_item_id: menu_item_id, 
            ingredient_id: ingredient_id, 
            num_ingredients: num_ingredients
        }

        await fetch(`${server}/api/manager/add_ingredients_in_menu_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const viewAllInInventory = async () => {

        try {
            const response = await fetch(`${server}/api/manager/view_all_in_inventory`, { method: 'POST', headers: { 'Content-Type': 'application/json' }});
        
            if (response.ok) {
                const data = await response.json();
            } else {
                console.error("Unable to view inventory.");
            }
        } catch (error) {
            console.error('Error:', error);
        }
        
    }

    const updateItemInInventory = async (ingredient_count, ingredient_id) => {

        var payload = {
            ingredient_count: ingredient_count, 
            ingredient_id: ingredient_id
        }

        await fetch(`${server}/api/manager/update_inventory_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const addInventoryItem = async (ingredient_name, ingredient_count, max_ingredient_count) => {

        var payload = {
            ingredient_name: ingredient_name,
            ingredient_count: ingredient_count,
            max_ingredient_count: max_ingredient_count
        }

        await fetch(`${server}/api/manager/add_inventory_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const deleteInventoryItem = async (ingredient_id) => {

        var payload = {
            ingredient_id: ingredient_id
        }

        await fetch(`${server}/api/manager/delete_inventory_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    /* STATISTICAL FUNCTIONS */

    const getSalesByTime = async (start_time, end_time, item_name) => {

        var payload = {
            startTime: start_time,
            endTime: end_time,
            itemName: item_name
        }

        try {
            const response = await fetch(`${server}/api/manager/get_sales_by_time`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        
            if (response.ok) {
                const report = await response.json();
            } else {
                console.error("Unable to fetch sales report.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getExcessReport = async (start_date) => {

        var payload = {
            start_date: start_date
        }
        
        try {
            const response = await fetch(`${server}/api/manager/get_excess_report`, { method: 'POST', headers: { 'Content-Type': 'applications/json' }, body: JSON.stringify(payload) });
            
            if (response.ok) {
                const report = await response.json();
            } else {
                console.error("Unable to fetch excess report.");
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getLowStock = async () => {

        try {
            const response = await fetch(`${server}/api/manager/get_low_stock`, { method: 'POST', headers: { 'Content-Type': 'applications/json' } });
            
            if (response.ok) {
                const report = await response.json();
            } else {
                console.error("Unable to fetch low stock items.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getWhatSellsTogether = async (start_time, end_time) => {

        var payload = {
            start_time: start_time,
            end_time: end_time
        }

        try {
            const response = await fetch(`${server}/api/manager/get_what_sells_together`, { method: 'POST', headers: { 'Content-Type': 'applications/json' }, body: JSON.stringify(payload) });
        
            if (response.ok) {
                const report = await response.json();
            } else {
                console.error("Unable to get paired item trend report.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }


    //Back-end implement needed
    const fetchSalesData = () => {
        // Mock data
        const mockSalesData = [
            { itemName: 'Pizza', totalSales: 20 },
            { itemName: 'Burger', totalSales: 15 },
        ];
        setSalesData(mockSalesData);
    };
    //Back-end implement needed
    const fetchEmployeeSchedules = () => { /* ... */ };


    fetchMenuItems();
    const addItemToMenu = async (menu_item_name, menu_item_category, item_description, price) => {
    
        var payload = {
            menu_item_name: menu_item_name,
            menu_item_category: menu_item_category,
            item_description: item_description,
            price: price
        }

        await fetch(`${server}/api/manager/add_item_to_menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const deleteItemFromMenu = async (menu_item_id) => {

        var payload = {
            menu_item_id: menu_item_id
        }

        await fetch(`${server}/api/manager/delete_item_from_menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }

    const editMenuItem = async (price, menu_item_id) => {

        var payload = {
            price: price,
            menu_item_id: menu_item_id
        }

        await fetch(`${server}/api/manager/edit_menu_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const addIngredientsToMenuItem = async (menu_item_id, ingredient_id, num_ingredients) => {

        var payload = {
            menu_item_id: menu_item_id, 
            ingredient_id: ingredient_id, 
            num_ingredients: num_ingredients
        }

        await fetch(`${server}/api/manager/add_ingredients_in_menu_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const viewAllInInventory = async () => {

        try {
            const response = await fetch(`${server}/api/manager/view_all_in_inventory`, { method: 'POST', headers: { 'Content-Type': 'application/json' }});
        
            if (response.ok) {
                const data = await response.json();
            } else {
                console.error("Unable to view inventory.");
            }
        } catch (error) {
            console.error('Error:', error);
        }
        
    }

    const updateItemInInventory = async (ingredient_count, ingredient_id) => {

        var payload = {
            ingredient_count: ingredient_count, 
            ingredient_id: ingredient_id
        }

        await fetch(`${server}/api/manager/update_inventory_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const addInventoryItem = async (ingredient_name, ingredient_count, max_ingredient_count) => {

        var payload = {
            ingredient_name: ingredient_name,
            ingredient_count: ingredient_count,
            max_ingredient_count: max_ingredient_count
        }

        await fetch(`${server}/api/manager/add_inventory_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    const deleteInventoryItem = async (ingredient_id) => {

        var payload = {
            ingredient_id: ingredient_id
        }

        await fetch(`${server}/api/manager/delete_inventory_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    /* STATISTICAL FUNCTIONS */

    const getSalesByTime = async (start_time, end_time, item_name) => {

        var payload = {
            startTime: start_time,
            endTime: end_time,
            itemName: item_name
        }

        try {
            const response = await fetch(`${server}/api/manager/get_sales_by_time`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        
            if (response.ok) {
                const report = await response.json();
            } else {
                console.error("Unable to fetch sales report.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getExcessReport = async (start_date) => {

        var payload = {
            start_date: start_date
        }
        
        try {
            const response = await fetch(`${server}/api/manager/get_excess_report`, { method: 'POST', headers: { 'Content-Type': 'applications/json' }, body: JSON.stringify(payload) });
            
            if (response.ok) {
                const report = await response.json();
            } else {
                console.error("Unable to fetch excess report.");
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getLowStock = async () => {

        try {
            const response = await fetch(`${server}/api/manager/get_low_stock`, { method: 'POST', headers: { 'Content-Type': 'applications/json' } });
            
            if (response.ok) {
                const report = await response.json();
            } else {
                console.error("Unable to fetch low stock items.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getWhatSellsTogether = async (start_time, end_time) => {

        var payload = {
            start_time: start_time,
            end_time: end_time
        }

        try {
            const response = await fetch(`${server}/api/manager/get_what_sells_together`, { method: 'POST', headers: { 'Content-Type': 'applications/json' }, body: JSON.stringify(payload) });
        
            if (response.ok) {
                const report = await response.json();
            } else {
                console.error("Unable to get paired item trend report.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }


    //Back-end implement needed



    fetchMenuItems();
    return (
        <div className={managerStyles.ManagerGUI}>
            {/* Navi Section */}
            <nav className={navStyles.NavBar}>
			<ul>
				<li><Link href="/customer"><a>Customer Page</a></Link></li>
				<li><Link href="/cashier"><a>Cashier Page</a></Link></li>
				<li><Link href="/manager"><a>Manager Page</a></Link></li>
			</ul>
		    </nav>
            <h1>Manager Dashboard</h1>

            {/* Menu Items List Section */}
            <section className={managerStyles.menuItemsList}>
                 <h2>Menu Items</h2>
                <button onClick={toggleMenuVisibility}>
                    {isMenuVisible ? 'Hide Menu Items' : 'Show Menu Items'}
                </button>
                {isMenuVisible && (
                    <div className={managerStyles.scrollableContainer} >
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.menu_item_id}>
                                <span>{item.menu_item_name} - ${item.price}</span>
                                <div>
                                <button className={managerStyles.addButton}>Add</button>
                                <button className={managerStyles.editButton}>Edit</button>
                                <button className={managerStyles.deleteButton}>X</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                )}
            </section>

            {/* Order Trends Section */}
            <section>
                <h2>Order Trends</h2>
                <label>
                    Start Date:
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </label>
                <label>
                    End Date:
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </label>
                <label>
                    Item:
                    <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
                        <option value="All">All Items</option>
                        {menuItems.map((item) => (
                            <option key={item.menu_item_id} value={item.menu_item_name}>
                                {item.menu_item_name}
                            </option>
                        ))}
                    </select>
                </label>
                <button onClick={fetchSalesData}>Fetch Sales Data</button>
                <ul>
                    {salesData.map((data, index) => (
                        <li key={index}>
                            {data.itemName}: {data.totalSales}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Inventory List Section */}
            <section>
                <h2>Inventory List</h2>
                <button onClick={fetchInventoryItems}>Fetch Inventory</button>
                <ul>
                    {inventoryItems.map((item, index) => (
                        <li key={index}>
                            {item.name} - Quantity: {item.quantity}
                        </li>
                    ))}
                </ul>
            </section>
            
            {/* Excess Report Section */}
            <section>
                <h2>Excess Reports</h2>
                <button onClick={fetchExcessReports}>Fetch Excess Reports</button>
                <ul>
                    {excessReports.map((report, index) => (
                        <li key={index}>
                            {report.date}: {report.item} - Excess: {report.quantity}
                        </li>
                    ))}
                </ul>
            </section>
            
            {/* Employee Schedules Section
            <section>
                <h2>Employee Schedules</h2>
                <button onClick={fetchEmployeeSchedules}>Fetch Schedules</button>
                <table>
                    <thead>
                        <tr>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeSchedules.map((schedule, index) => (
                            <tr key={index}>
                                <td>{schedule.employeeName}</td>
                                <td>{schedule.role}</td>
                                <td>{schedule.shiftStart}</td>
                                <td>{schedule.shiftEnd}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>             */}
        </div>
    );
}

export default Manager;