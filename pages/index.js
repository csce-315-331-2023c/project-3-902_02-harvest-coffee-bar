import Link from 'next/link'

const Index = () => (
	<div>
		Hello World.{' '}
		<ul>
			<li><Link href="/customer"><a>Customer Page</a></Link></li>
			<li><Link href="/cashier"><a>Cashier Page</a></Link></li>
			<li><Link href="/manager"><a>Manager Page</a></Link></li>
		</ul>
	</div>
)

export default Index;
