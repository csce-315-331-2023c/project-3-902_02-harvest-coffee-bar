import styles from './FooterStyle.module.css';
import Link from 'next/link';

export default function FooterBar() {
    return (
        <nav className={styles.FooterBar}>
            <div>
                <ul>
                    <li><Link href="/customer"><a className={styles.orderButton}>Order Online</a></Link></li>
                    <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
                    <li><Link href="/manager"><a>Contact Us!</a></Link></li>
                </ul>
                <hr></hr>
                <p>Powered by Kirkland Signature Developers</p>
            </div>
        </nav>
    );
}