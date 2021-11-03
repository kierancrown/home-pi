import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <Head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#90cdf4" />
                <link rel="apple-touch-icon" href="/logo-96x96.png" />
                <meta name="apple-mobile-web-app-status-bar" content="#90cdf4" />
            </Head>
            <div className="p-6">
                <Component {...pageProps} />
            </div>
        </>
    );
}

export default MyApp;
