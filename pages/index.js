import navStyles from './components/NavBar.module.css';
import coffeeStyles from './components/harvestCoffeeBar.module.css';
import Link from 'next/link';

const Index = () => (
	<div>
		<nav className={navStyles.NavBar}>
			<ul>
				<li><Link href="/customer">Customer Page</Link></li>
				<li><Link href="/cashier">Cashier Page</Link></li>
				<li><Link href="/manager">Manager Page</Link></li>
			</ul>
		</nav>
		<div className={coffeeStyles.coffeeBar}>
			<h1>Welcome to Our Coffee Bar</h1>
			<p>Discover the finest coffee experience in town.</p>
		</div>
	</div>
)

export default Index;
