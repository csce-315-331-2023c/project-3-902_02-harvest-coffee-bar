import Link from 'next/link'
// import Head from 'next/head'
// import { Montserrat } from '@next/font/google'
const Index = () => (
	//<Head className={Montserrat.className}>
	<div>
		Hello World.{' '}
		<ul>
			<li><Link href="/customer"><a>Customer Page</a></Link></li>
			<li><Link href="/cashier"><a>Cashier Page</a></Link></li>
			<li><Link href="/manager"><a>Manager Page</a></Link></li>
		</ul>
	</div>
	//</Head>
)

export default Index;
