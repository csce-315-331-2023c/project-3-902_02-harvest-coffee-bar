// components/NavBar.js
import Link from 'next/link';
import styles from './NavBar.module.css'; // Create a CSS module for styling

const NavBar = () => {
    return (
        <nav className={styles.NavBar}>
            <ul>
                <li><Link href="/customer"><a>Customer Page</a></Link></li>
                <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
                <li><Link href="/manager"><a>Manager Page</a></Link></li>
            </ul>
        </nav>
    );
};

export default NavBar;