// pages/manager.js

import { useState } from 'react';
import { server } from '../config';

function Manager() {
    const [menuItems, setMenuItems] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedItem, setSelectedItem] = useState('All');
    const [inventoryItems, setInventoryItems] = useState([]);
    const [excessReports, setExcessReports] = useState([]);
    const [employeeSchedules, setEmployeeSchedules] = useState([]);

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
    const fetchInventoryItems = () => { /* ... */ };
    const fetchExcessReports = () => { /* ... */ };
    const fetchEmployeeSchedules = () => { /* ... */ };


    return (
        <div>
            <h1>Manager Dashboard</h1>

            {/* Menu Items List Section */}
            <section>
                <h2>Menu Items</h2>
                <button onClick={fetchMenuItems}>Fetch Menu Items</button>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.menu_item_id}>
                            {item.menu_item_name} - ${item.price}
                        </li>
                    ))}
                </ul>
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
            
            {/* Employee Schedules Section */}
            <section>
                <h2>Employee Schedules</h2>
                <button onClick={fetchEmployeeSchedules}>Fetch Schedules</button>
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Role</th>
                            <th>Shift Start</th>
                            <th>Shift End</th>
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
            </section>            
        </div>
    );
}

export default Manager;