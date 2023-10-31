import Link from 'next/link'
import Head from 'next/head'
import NavBar from './components/navBar';
import CoffeeBar from './components/harvestCoffeeBar';
// import { Montserrat } from '@next/font/google'
const Index = () => (
	<div>
		<NavBar />
		<CoffeeBar />
	</div>
)

export default Index;
