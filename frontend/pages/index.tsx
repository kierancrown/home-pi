import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import LightsView from '../components/lights';

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Home Pi - Overview</title>
                <meta name="description" content="Home Pi is home automation software written by Kieran Crown" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="header space-y-3 flex flex-col mb-10">
                <Link href="/setup" passHref>
                    <h1 className="text-5xl font-bold">Overview - Test</h1>
                </Link>
                <h2 className="text-2xl font-medium ml-1">This will show all connected devices in all rooms</h2>
            </div>
            <LightsView />
        </div>
    );
};

export default Home;
