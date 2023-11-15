// pages/manager.js

import { useState } from 'react';
import { server } from '../config';
import Link from 'next/link';
import navStyles from './components/NavBar.module.css';
import managerStyles from './components/ManagerGUIStyle.module.css'

function Manager() {
    //menu item list section state
    const [menuItems, setMenuItems] = useState([]);
    const [isMenuVisible, setIsMenuVisible] = useState(false); 
    const [showAddForm, setShowAddForm] = useState(false);
    const toggleMenuVisibility = () => {
        setIsMenuVisible(!isMenuVisible); 
    };
    const [selectedItemInventory, setSelectedItemInventory] = useState({});

    const [salesData, setSalesData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedItem, setSelectedItem] = useState('All');
    const [inventoryItems, setInventoryItems] = useState([]);
    const [excessReports, setExcessReports] = useState([]);
    // const [employeeSchedules, setEmployeeSchedules] = useState([]);
    


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

    //dummy function for inventory of given menu item
    const handleMenuItemClick = (itemId) => {
        // Mock inventory data 
        const mockInventory = {
            [itemId]: [
                { id: 1, name: "Inventory Item 1", quantity: 10 },
                { id: 2, name: "Inventory Item 2", quantity: 5 }
            ]
        };
    
        setSelectedItemInventory(mockInventory);
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

    //Front-end handling function for addItemToMenu {
    const showAddItemForm = () => {

        setShowAddForm(true);

    };

    const [newMenuItem, setNewMenuItem] = useState({

        menu_item_name: '',
        menu_item_category: '',
        item_description: '',
        price: 0,

    });

    const handleInputChange = (e) => {

        setNewMenuItem({ ...newMenuItem, [e.target.name]: e.target.value });

    };

    const submitAddItemForm = async (e) => {

        e.preventDefault();

        await addItemToMenu(
            newMenuItem.menu_item_name,
            newMenuItem.menu_item_category,
            newMenuItem.item_description,
            newMenuItem.price
        );

        setShowAddForm(false);
        fetchMenuItems();
    };
    //}

    const deleteItemFromMenu = async (menu_item_id) => {

        var payload = {
            menu_item_id: menu_item_id
        }

        await fetch(`${server}/api/manager/delete_item_from_menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        // fetchMenuItems();
    }

    const editMenuItem = async (price, menu_item_id) => {

        var payload = {
            price: price,
            menu_item_id: menu_item_id
        }

        await fetch(`${server}/api/manager/edit_menu_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    //Front-end handling function for editMenuItem {
    const handleEdit = (menu_item_id, currentPrice) => {

        const newPrice = prompt(`Enter new price for the item (Current Price: $${currentPrice}):`, currentPrice);

        if (newPrice !== null && newPrice !== '') {
            editMenuItem(newPrice, menu_item_id);
        }

        fetchMenuItems();
    };
    //}

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
            <h1> Manager Dashboard </h1>

            {/* Menu Items List Section */}
            <section className={managerStyles.menuItemsList}>
                 <h2> Menu Items </h2>
                <button onClick={toggleMenuVisibility}>
                    {isMenuVisible ? 'Hide Menu Items' : 'Show Menu Items'}
                </button>
                {isMenuVisible && (
                    <div className={managerStyles.scrollableContainer}>  
                    <div className={managerStyles.addItemForm}>
                    <button 
                        className={managerStyles.addItemButton} 
                        onClick={showAddItemForm}> 
                            Add new item
                    </button>

                    {/* test */}
                    {/* <button 
                        className={managerStyles.addItemButton} 
                        onClick={() => addItemToMenu("testname", "testcategory", "testdescription", "0")}> 
                        Add new item
                    </button> */}
                    
                    {showAddForm && (
                        <form onSubmit={submitAddItemForm}>
                            <div className={managerStyles.addItemInput}>
                                <input
                                    type="text"
                                    name="menu_item_name"
                                    placeholder="Item Name"
                                    value={newMenuItem.menu_item_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={managerStyles.addItemInput}>
                                <input
                                    type="text"
                                    name="menu_item_category"
                                    placeholder="Item Category"
                                    value={newMenuItem.menu_item_category}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={managerStyles.addItemInput}>
                            <textarea
                                name="item_description"
                                placeholder="Item Description"
                                value={newMenuItem.item_description}
                                onChange={handleInputChange}
                            />
                            </div>
                            <div className={managerStyles.addItemInput}>
                            <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={newMenuItem.price}
                                onChange={handleInputChange}
                            />
                            </div>
                            <button 
                                className={managerStyles.addItemFormButton} 
                                type="submit"> 
                                    Submit 
                            </button>
                            <button 
                                className={managerStyles.addItemFormButton} 
                                onClick={() => setShowAddForm(false)}>
                                    Cancel
                            </button>
                        </form>
                    )}
                    </div>
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.menu_item_id}>
                                <div className={managerStyles.firstlineList}>
                                    <span  
                                        onClick={() => handleMenuItemClick(item.menu_item_id)}> 
                                        {item.menu_item_name} - ${item.price} 
                                    </span>
                                    <div className={managerStyles.buttonContainer}>
                                        <button 
                                            className={managerStyles.addInventoryButton}> 
                                                Add 
                                        </button>
                                        <button 
                                            className={managerStyles.editButton}
                                            onClick={() => handleEdit(item.menu_item_id, item.price)}>
                                                Edit
                                        </button>
                                        <button 
                                            className={managerStyles.deleteButton} 
                                            onClick={() => deleteItemFromMenu(item.menu_item_id)}>
                                                X
                                        </button>
                                    </div>
                                </div>
                                {/* Display inventory for given menu item */}
                                {selectedItemInventory[item.menu_item_id] && (
                                    <ul className={managerStyles.inventoryList}>
                                        {selectedItemInventory[item.menu_item_id].map((inventoryItem) => (
                                            <li className={managerStyles.inventoryListItem} key={inventoryItem.id}>
                                                {inventoryItem.name} - Quantity: {inventoryItem.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                )}
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
                <button onClick={getSalesByTime}>Fetch Sales Data</button>
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
                <button onClick={viewAllInInventory}>view All In Inventory</button>
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
                <button onClick={getExcessReport}>Fetch Excess Reports</button>
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