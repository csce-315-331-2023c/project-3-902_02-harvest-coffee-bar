import styles from './FooterStyle.module.css';
import Link from 'next/link';

export default function FooterBar() {
    return (
        <nav className={styles.FooterBar}>
            <div>
                <ul>
                    <li><p>Contact Us!</p></li>
                </ul>
                <hr></hr>
                <div className={styles.PoweredBy}>
                    <p>Powered by Kirkland Signature Developers</p>
                </div>
            </div>
        </nav>
    );
}