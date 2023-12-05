import styles from './NavBar.module.css';
import loginStyles from './login.module.css';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function NavBar() {
  const { data: session } = useSession();

  const handleLogin = () => {
    signIn('google');
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <nav className={styles.NavBar}>
      <div>
        <ul>
          {session ? (
            <>
              <li className={`${styles.li} ${styles.login}`}>
                <button onClick={handleLogout} className={`${loginStyles.LoginLink} ${styles.button}`}>
                  <a className={loginStyles.LoginLink}>{session.user.name}</a>
                </button>
              </li>
              {session.user.role === 'Cashier' && (
                <>
                  <li><Link href="/"><a>Home</a></Link></li>
                  <li><Link href="/customer"><a className={styles.orderButton}>Order Online</a></Link></li>
                  <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
                </>
              )}
              {session.user.role === 'Manager' && (
                <>
                  <li><Link href="/"><a>Home</a></Link></li>
                  <li><Link href="/customer"><a className={styles.orderButton}>Order Online</a></Link></li>
                  <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
                  <li><Link href="/manager"><a>Manager Page</a></Link></li>
                </>
              )}
              {session.user.role === 'Admin' && (
                <>
                  <li><Link href="/"><a>Home</a></Link></li>
                  <li><Link href="/customer"><a className={styles.orderButton}>Order Online</a></Link></li>
                  <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
                  <li><Link href="/manager"><a>Manager Page</a></Link></li>
                </>
              )}
            </>
          ) : (
            <><li className={`${styles.li} ${styles.login}`}>
              <button onClick={handleLogin} className={`${loginStyles.LoginLink} ${styles.button}`}>
                <a className={loginStyles.LoginLink}>Login</a>
              </button>
            </li><li><Link href="/"><a>Home</a></Link></li><li><Link href="/customer"><a className={styles.orderButton}>Order Online</a></Link></li></>
          )}

        </ul>
      </div>
    </nav>
  );
}