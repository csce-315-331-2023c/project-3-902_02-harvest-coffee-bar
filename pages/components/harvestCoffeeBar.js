// components/CoffeeBar.js

import React from 'react';
import styles from './harvestCoffeeBar.module.css';

const coffeeBar = () => {
    return (
        <div className={styles.coffeeBar}>
            <h1>Welcome to Our Coffee Bar</h1>
            <p>Discover the finest coffee experience in town.</p>
        </div>
    );
};

export default coffeeBar;