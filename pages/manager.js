// pages/manager.js

import { useState, useEffect } from 'react';
import { server } from '../config';
import Link from 'next/link';
import navStyles from './components/NavBar.module.css';
import managerStyles from './components/ManagerGUIStyle.module.css'

function Manager() {
    ////////////////////////
    // Defalt State Below //
    ////////////////////////

    //menu item list section state
    const [menuItems, setMenuItems] = useState([]);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [showAddItemForm, setShowAddItemForm] = useState(false);
    const toggleMenuVisibility = () => {
        setIsMenuVisible(!isMenuVisible);
    };
    const [newMenuItem, setNewMenuItem] = useState({
        menu_item_name: '',
        menu_item_category: '',
        item_description: '',
        price: 0,
    });
    const [selectedItemInventory, setSelectedItemInventory] = useState({});
    const [showAddIngredientsToItemForm, setShowAddIngredientsToItemForm] = useState(null);
    const [addIngredientsToItem, setAddIngredientsToItem] = useState({
        ingredient_id: '',
        num_ingredients: ''
    });

    //order trends section state
    const [selectedItem, setSelectedItem] = useState('All');
    const [salesData, setSalesData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [popularPairsData, setPairsData] = useState([]);
    const [PopularPairstartDate, setPopularPairStartDate] = useState('');
    const [PopularPairendDate, setPopularPairEndDate] = useState('');
    
    //inventory list section state
    const [inventoryItems, setInventoryItems] = useState([]);
    const [isInventoryVisible, setIsInventoryVisible] = useState(false);
    const toggleInventoryVisibility = () => {
        setIsInventoryVisible(!isInventoryVisible);
    };
    const [showAddInventoryForm, setShowAddInventoryForm] = useState(false);
    const [newInventory, setNewInventory] = useState({
        ingredient_name: '',
        ingredient_count: 0,
        max_ingredient_count: 0
    });

    //stock report section state
    const [excessReports, setExcessReports] = useState([]);
    const [excessReportstartDate, setExcessReportstartDate] = useState('');
    const [lowStock, setLowStock] = useState([]);

    /////////////////////////////
    // back-end function below //
    /////////////////////////////

    const fetchMenuItems = async () => {
        try {
            //attempt to fetch menu items
            const response = await fetch(`${server}/api/manager/get_all_menu_items`);

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

    const addItemToMenu = async (item_name, item_category, description, item_price) => {

        var payload = {
            menu_item_name: item_name,
            menu_item_category: item_category,
            item_description: description,
            price: item_price
        }

        await fetch(`${server}/api/manager/add_item_to_menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    //Front-end handling function for addItemToMenu {
    const showAddItemFormHandler = () => {

        setShowAddItemForm(true);

    };

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

        setShowAddItemForm(false);
        fetchMenuItems();
    };
    //}

    const deleteItemFromMenu = async (menu_item_id) => {

        var payload = {
            menu_item_id: menu_item_id
        }

        await fetch(`${server}/api/manager/delete_item_from_menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        fetchMenuItems();
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

    const getInventoryByItem = async (menu_item_id) => {

        var payload = {
            menu_item_id: menu_item_id
        }

        try {
            const response = await fetch(`${server}/api/manager/get_inventory_by_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)});
        
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error("Unable to view inventory.");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    //Front-end handling function for getInventoryByItem {

    const handleMenuItemClick = async (itemId) => {
        try {
            const inventoryData = await getInventoryByItem(itemId);
            const updatedInventory = { [itemId]: inventoryData };
            setSelectedItemInventory(updatedInventory);
        } catch (error) {
            console.error('Error:', error);
        }
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

    //Front-end handling function for addIngredientsToMenuItem {
    const handleAddIngredientsToItemChange = (e) => {
        setAddIngredientsToItem({ ...addIngredientsToItem, [e.target.name]: e.target.value });
    };

    const submitAddIngredientsToItemForm = async (e, menu_item_id) => {
        e.preventDefault();
        await addIngredientsToMenuItem(menu_item_id, addIngredientsToItem.ingredient_id, addIngredientsToItem.num_ingredients);

        setAddIngredientsToItem({ ingredient_id: '', num_ingredients: '' });
        setShowAddIngredientsToItemForm(null);
        //refresh the inventorylist -- need further implement
        handleMenuItemClick(menu_item_id);
    };
    //}

    const viewAllInInventory = async () => {

        try {
            const response = await fetch(`${server}/api/manager/view_all_in_inventory`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });

            if (response.ok) {
                const data = await response.json();
                setInventoryItems(data.data);
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

    //Front-end handling function for editMenuItem {
    const handleUpdate = (currentCount , ingredient_id) => {

            const newCount = prompt(`Enter current count for the ingredient (Current Count: ${currentCount}):`, currentCount);
    
            if (newCount !== null && newCount !== '') {
                updateItemInInventory(newCount, ingredient_id);
            }
    
            viewAllInInventory();
        };
        //}

    const addInventoryItem = async (ingredient_name, ingredient_count, max_ingredient_count) => {

        var payload = {
            ingredient_name: ingredient_name,
            ingredient_count: ingredient_count,
            max_ingredient_count: max_ingredient_count
        }

        await fetch(`${server}/api/manager/add_inventory_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    }

    //Front-end handling function for addInventoryItem {
    const showAddInventoryFormHandler = () => {

        setShowAddInventoryForm(true);

    };

    const handleInventoryInputChange = (e) => {

        setNewInventory({ ...newInventory, [e.target.name]: e.target.value });

    };

    const submitAddInventoryForm = async (e) => {

        e.preventDefault();

        await addInventoryItem(
            newInventory.ingredient_name,
            newInventory.ingredient_count,
            newInventory.max_ingredient_count,
        );

        setShowAddInventoryForm(false);
        viewAllInInventory();
    };
    //}

    const deleteInventoryItem = async (ingredient_id) => {

        var payload = {
            ingredient_id: ingredient_id
        }

        await fetch(`${server}/api/manager/delete_inventory_item`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        viewAllInInventory();
    }

    const handleStatusChange = async (menu_item_id, value) => {
        
        if (value == "") {

        } else {

            if (value == "Sold") {
                is_active = true;
            } else if (value == "Not Sold") {
                is_active = false;
            }

            var payload = {
                is_active: is_active,
                menu_item_id: menu_item_id
            }
    
            console.log(payload);
    
            await fetch(`${server}/api/manage/toggle_is_active`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    
        }

    }

    /* STATISTICAL FUNCTIONS */

    const getSalesByTime = async (start_time, end_time, item_name) => {
        setSalesData([]);

        var payload = {
            start_time: start_time,
            end_time: end_time,
            item_name: item_name
        }

        console.log(payload);

        try {
            const response = await fetch(`${server}/api/manager/get_sales_by_time`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

            if (response.ok) {
                const report = await response.json();
                setSalesData(report);
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

        console.log(payload);

        try {
            const response = await fetch(`${server}/api/manager/get_excess_report`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

            if (response.ok) {
                const report = await response.json();
                setExcessReports (report.data);
            } else {
                console.error("Unable to fetch excess report.");
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getLowStock = async () => {

        try {
            const response = await fetch(`${server}/api/manager/get_low_stock`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });

            if (response.ok) {
                const report = await response.json();
                setLowStock (report.data);
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
            const response = await fetch(`${server}/api/manager/get_what_sells_together`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

            if (response.ok) {
                const report = await response.json();
                setPairsData(report);
            } else {
                console.error("Unable to get paired item trend report.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    


    ///////////////////////////////
    // Front-end Implement Below //
    ///////////////////////////////
    useEffect(() => {

        fetchMenuItems();
        viewAllInInventory();

    }, []);

    return (
        <div className={managerStyles.ManagerGUI}>
            {/* Navi Section */}
            <nav className={navStyles.NavBar}>
                <ul>
                    <li><Link href="/customer">Customer Page</Link></li>
                    <li><Link href="/cashier">Cashier Page</Link></li>
                    <li><Link href="/manager">Manager Page</Link></li>
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
                                onClick={showAddItemFormHandler}>
                                    Add new item
                            </button>
                            {showAddItemForm && (
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
                                        onClick={() => setShowAddItemForm(false)}>
                                            Cancel
                                    </button>
                                </form>
                            )}
                        </div>
                        <ul>
                            {menuItems.map((item) => (
                                <li key={item.menu_item_id}>
                                    <div className={managerStyles.firstlineList}
                                        // Need Back-end implement - dummy function of inventory for selected item
                                        onClick={() => handleMenuItemClick(item.menu_item_id)}>
                                        <span
                                            // Need Back-end implement - dummy function of inventory for selected item
                                            onClick={() => handleMenuItemClick(item.menu_item_id)}>
                                            {item.menu_item_name} - ${item.price}
                                        </span>
                                        <div className={managerStyles.buttonContainer}>
                                            <button
                                                className={managerStyles.addInventoryButton}
                                                onClick={() => setShowAddIngredientsToItemForm(item.menu_item_id)}>
                                                    Add new inventory
                                            </button>
                                            <button
                                                className={managerStyles.editButton}
                                                onClick={() => handleEdit(item.menu_item_id, item.price)}>
                                                    Edit price
                                            </button>
                                            <select
                                                className={managerStyles.statusDropdown}>
                                                {/* onChange={(e) => handleStatusChange(item.menu_item_id, e.target.value)} */}
                                                <option value="">Select Status</option>
                                                <option value="Sold">Sold</option>
                                                <option value="Not Sold">Not Sold</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={managerStyles.addIngredientsToItemToMenuItemForm}>
                                        {showAddIngredientsToItemForm === item.menu_item_id && (
                                            <form onSubmit={(e) => submitAddIngredientsToItemForm(e, item.menu_item_id)}>
                                                <input
                                                    type="number"
                                                    name="ingredient_id"
                                                    placeholder="Ingredient ID"
                                                    value={addIngredientsToItem.ingredient_id}
                                                    onChange={handleAddIngredientsToItemChange}
                                                />
                                                <input
                                                    type="number"
                                                    name="num_ingredients"
                                                    placeholder="Number of Ingredients"
                                                    value={addIngredientsToItem.num_ingredients}
                                                    onChange={handleAddIngredientsToItemChange}
                                                />
                                                <button type="submit">Submit</button>
                                                <button onClick={() => setShowAddIngredientsToItemForm(null)}>Cancel</button>
                                            </form>
                                        )}
                                    </div>
                                    {/* Display inventory for given menu item */}
                                    {selectedItemInventory[item.menu_item_id] && (
                                        <ul className={managerStyles.inventoryList}>
                                            {selectedItemInventory[item.menu_item_id].map((inventoryItem) => (
                                                <li className={managerStyles.inventoryListItem} key={inventoryItem.id}>
                                                    {inventoryItem.ingredient_name} - Quantity: {inventoryItem.num_ingredients}
                                                    <div className={managerStyles.inventoryListButton}>


                                                        {/* <button 
                                                            className={managerStyles.editButton}
                                                            onClick={() => handleEdit(item.menu_item_id, item.price)}>
                                                                Edit price
                                                        </button>
                                                        <button 
                                                            className={managerStyles.deleteButton} 
                                                            onClick={() => deleteItemFromMenu(item.menu_item_id)}>
                                                                X
                                                        </button> */}
                                                    </div>
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
            <section className = {managerStyles.orderTrends}>
                <h2>Order Trends</h2>
                {/* Sales Report Div */}
                <div className = {managerStyles.salesData}>
                    <h3>Sales Report: </h3>
                    <label className = {managerStyles.salesDataLabel}>
                            Start Date:
                        <input type = "date" value = {startDate} onChange = {(e) => setStartDate(e.target.value)} />
                    </label>
                    <label className = {managerStyles.salesDataLabel}>
                            End Date:
                        <input type = "date" value = {endDate} onChange ={ (e) => setEndDate(e.target.value)} />
                    </label>
                    <label className = {managerStyles.salesDataLabel}>
                            Item: &nbsp;
                        <select value = {selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
                            <option value="All">All Items</option>
                            {menuItems.map((item) => (
                                <option key = {item.menu_item_id} value = {item.menu_item_name}>
                                    {item.menu_item_name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        className = {managerStyles.salesDataButton}
                        onClick = {() => getSalesByTime(startDate, endDate, selectedItem)}>
                            View Sales
                    </button>
                    <ul className={managerStyles.salesDataList}>
                        {salesData.map((data, index) => (
                            //Need Back-end implement - list out sales. 
                            <li key = {index} className = {managerStyles.salesDataListItem}>
                                {data.item}: {data.total_sales}, total profit: {data.total_profit}
                            </li>
                        ))}
                    </ul>
                </div>

                <br></br>
                {/* Popular Item Pairs Div */}
                <div className={managerStyles.popularPairs}>
                    <h3>Popular Item Pairs: </h3>
                    <label>
                            Start Date:
                        <input type="date" value={PopularPairstartDate} onChange={(e) => setPopularPairStartDate(e.target.value)} />
                    </label>
                    <label>
                            End Date:
                        <input type="date" value={PopularPairendDate} onChange={(e) => setPopularPairEndDate(e.target.value)} />
                    </label>
                    <button
                        onClick={() => getWhatSellsTogether(PopularPairstartDate, PopularPairendDate)}>
                            View Pairs
                    </button>
                    <ul>
                        {popularPairsData.map((data, index) => (
                            //Need Back-end implement - list out sales. 
                            <li key={index}>
                                {data.i1_name} : {data.i2_name} - {data.frequency}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Inventory List Section */}
            <section className = {managerStyles.InventoryList}> 
                <h2>Inventory List</h2>
                <button 
                    className={managerStyles.viewListButton}
                    onClick={toggleInventoryVisibility}>
                    {isInventoryVisible ? 'Hide Inventory' : 'View All Inventory'}
                </button>
                {isInventoryVisible && (
                    <div className={managerStyles.scrollableContainer}>
                        <div className={managerStyles.addInventoryForm}>
                            <button
                                className={managerStyles.addInventoryButton}
                                onClick={showAddInventoryFormHandler}>
                                    Add new ingredient
                            </button>
                            {showAddInventoryForm && (
                                <form onSubmit={submitAddInventoryForm}>
                                    <div className={managerStyles.addInventoryInput}>
                                        <input
                                            type="text"
                                            name="ingredient_name"
                                            placeholder="Ingredient Name"
                                            value={newInventory.ingredient_name}
                                            onChange={handleInventoryInputChange}
                                        />
                                    </div>
                                    <div className={managerStyles.addInventoryInput}>
                                        <input
                                            type="number"
                                            name="ingredient_count"
                                            placeholder="Ingredient Count"
                                            value={newInventory.ingredient_count}
                                            onChange={handleInventoryInputChange}
                                        />
                                    </div>
                                    <div className={managerStyles.addInventoryInput}>
                                        <input
                                            type="number" 
                                            name="max_ingredient_count"
                                            placeholder="Maximum Ingredient Count"
                                            value={newInventory.max_ingredient_count}
                                            onChange={handleInventoryInputChange}
                                        />
                                    </div>
                                    <button
                                        className={managerStyles.addInventoryFormButton}
                                        type="submit">
                                            Submit
                                    </button>
                                    <button
                                        className={managerStyles.addInventoryFormButton}
                                        onClick={() => setShowAddInventoryForm(false)}>
                                            Cancel
                                    </button>
                                </form>
                            )}
                        </div>
                        <ul>
                            {inventoryItems.map((item, index) => (
                                <li key={index}>
                                        <span>
                                            {item.ingredient_name} (ID: {item.ingredient_id}) - Quantity: {item.ingredient_count}
                                        </span>
                                        <div className={managerStyles.buttonContainer}>
                                            <button
                                                className={managerStyles.editButton}
                                                onClick={() => handleUpdate(item.ingredient_count, item.ingredient_id)}>
                                                    Update Inventory
                                            </button>
                                            <button
                                                className={managerStyles.deleteButton}
                                                onClick={() => deleteInventoryItem(item.ingredient_id)}>
                                                    X
                                            </button>
                                        </div>
                                </li>
                            ))}
                        </ul>
                </div>
                )}
            </section>

            {/* Stock Report Section */}
            <section className = {managerStyles.stockReport}>
                <h2>Stock Reports</h2>
                {/* Excess Reports Div */}
                <div className = {managerStyles.excessReports}>
                    <h3>Excess Reports: </h3>
                    <label className = {managerStyles.excessReportsLabel}>
                            Start Date:
                        <input type = "date" value = {excessReportstartDate} onChange = {(e) => setExcessReportstartDate(e.target.value)} />
                    </label>
                    <button 
                        className={managerStyles.excessReportsButton}
                        onClick={() => getExcessReport(excessReportstartDate)}>
                            View Reports
                    </button>
                    <ul className={managerStyles.excessReportsList}>
                        {excessReports.map((report, index) => (
                            <li key={index} className = {managerStyles.excessReportsListItem}>
                               {report.ingredient_name} - Excess: {report.total_items_sold}
                            </li>
                        ))}
                    </ul>
                </div>

                <br></br>
                {/* Low Stock Div */}
                <div className={managerStyles.lowStockAlarm}>
                    <h3>Low Stock Alarm: </h3>
                    <button
                        onClick={() => getLowStock()}>
                            View Alarm
                    </button>
                    <ul>
                        {lowStock.map((report, index) => (
                            //Need Back-end implement - list out sales. 
                            <li key={index}>
                                {report.ingredient_name} - Current Count: {report.ingredient_count}
                            </li>
                        ))}
                    </ul>
                </div>
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