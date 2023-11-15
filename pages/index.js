import navStyles from './components/NavBar.module.css';
import coffeeStyles from './components/harvestCoffeeBar.module.css';
import loginStyles from "./components/login.module.css";
import { signIn } from 'next-auth/react'
import Link from 'next/link';

const Index = () => (
	<div>
		<nav className={navStyles.NavBar}>
			<ul>
				<li className={`${navStyles.li} ${navStyles.login}`}>
      				<button onClick={() => signIn('google')} className={`${loginStyles.LoginLink} ${navStyles.button}`}>
        				<a className={loginStyles.LoginLink}>Login</a>
					</button>
				</li>
				<li><Link href="/customer"><a>Customer Page</a></Link></li>
				<li><Link href="/cashier"><a>Cashier Page</a></Link></li>
				<li><Link href="/manager"><a>Manager Page</a></Link></li>
			</ul>
		</nav>
		<div className={coffeeStyles.coffeeBar}>
			<h1>Welcome to Our Coffee Bar</h1>
			<p>Discover the finest coffee experience in town.</p>
		</div>
	</div>
)

export default Index;
