import styles from './NavBar.module.css';
import loginStyles from './login.module.css';
import TranslationComponent from './TranslationComponent';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function NavBar() {
    return (
        <nav className={styles.NavBar}>
            <div>
                <ul>
                    <li className={`${styles.li} ${styles.login}`}>
                        <button onClick={() => signIn('google')} className={`${loginStyles.LoginLink} ${styles.button}`}>
                            <a className={loginStyles.LoginLink}>Login</a>
                        </button>
                    </li>
                    <li><Link href="/index"><a>Home</a></Link></li>
                    <li><Link href="/customer"><a className={styles.orderButton}>Order Online</a></Link></li>
                    <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
                    <li><Link href="/manager"><a>Manager Page</a></Link></li>
                </ul>
            </div>
        </nav>
    );
}