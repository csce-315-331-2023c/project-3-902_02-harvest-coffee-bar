import styles from './NavBar.module.css';
import loginStyles from './login.module.css';
import TranslationComponent from './TranslationComponent';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

// export default function NavBar() {
//     const { data: session } = useSession();
//     const handleLogin = () => {
//         signIn('google');
//     };
    
//     const handleLogout = () => {
//         signOut();
//     };
//     return (
//         <nav className={styles.NavBar}>
//             <div>
//                 <ul>
//                 {session ? (
//                     <>
//                         <li className={`${styles.li} ${styles.login}`}>
//                             <button onClick={() => signIn('google')} className={`${loginStyles.LoginLink} ${styles.button}`}>
//                                 <a className={loginStyles.LoginLink}>Login</a>
//                             </button>
//                         </li>
//                         {session.role === 'customer' && (
//                             <li><Link href="/"><a>Home</a></Link></li>
//                         )}
//                         {session.role === 'cashier' && (
//                             <>
//                             <li><Link href="/"><a>Home</a></Link></li>
//                             <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
//                             </>
//                         )}
//                         {session.role === 'manager' && (
//                             <>
//                             <li><Link href="/"><a>Home</a></Link></li>
//                             <li><Link href="/customer"><a>Customer Page</a></Link></li>
//                             <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
//                             <li><Link href="/manager"><a>Manager Page</a></Link></li>
//                             </>
//                         )}
//                     </>
//                 ) : (
                    
//                     // <li><Link href="/"><a>Home</a></Link></li>
//                     // <li><Link href="/customer"><a className={styles.orderButton}>Order Online</a></Link></li>
//                     // <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
//                     // <li><Link href="/manager"><a>Manager Page</a></Link></li>
//                 </ul>
//             </div>
//         </nav>
//     );
// }

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
                    <a className={loginStyles.LoginLink}>Logout</a>
                  </button>
                </li>
                {session.role === 'customer' && (
                <>
                  <li><Link href="/"><a>Home</a></Link></li>
                  <li><Link href="/customer"><a className={styles.orderButton}>Order Online</a></Link></li>
                </>
              )}
                {session.role === 'cashier' && (
                  <>
                    <li><Link href="/"><a>Home</a></Link></li>
                    <li><Link href="/customer"><a className={styles.orderButton}>Order Online</a></Link></li>
                    <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
                  </>
                )}
                {session.role === 'manager' && (
                  <>
                    <li><Link href="/"><a>Home</a></Link></li>
                    <li><Link href="/customer"><a className={styles.orderButton}>Order Online</a></Link></li>
                    <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
                    <li><Link href="/manager"><a>Manager Page</a></Link></li>
                  </>
                )}
                {session.role === 'admin' && (
                  <>
                    <li><Link href="/"><a>Home</a></Link></li>
                    <li><Link href="/customer"><a className={styles.orderButton}>Order Online</a></Link></li>
                    <li><Link href="/cashier"><a>Cashier Page</a></Link></li>
                    {/* <li><Link href="/manager"><a>Manager Page</a></Link></li> */}
                  </>
                )}
              </>
            ) : (
              <li className={`${styles.li} ${styles.login}`}>
                <button onClick={handleLogin} className={`${loginStyles.LoginLink} ${styles.button}`}>
                  <a className={loginStyles.LoginLink}>Login</a>
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }