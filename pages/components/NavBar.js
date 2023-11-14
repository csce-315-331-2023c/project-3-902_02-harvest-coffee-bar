import styles from './NavBar.module.css';
import Link from 'next/link';

export default function NavBar() {
    return (
        <nav className={styles.NavBar}>
            <div>
                <ul>
                    <li><Link href="/customer"><a className={styles.orderButton}>Order Online</a></Link></li>
                    <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
                    <li><Link href="/manager"><a>Manager Page</a></Link></li>
                </ul>
            </div>
        </nav>
    );
}