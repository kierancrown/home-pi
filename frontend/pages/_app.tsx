import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import SetupContextProvider from '../context/setup';
import HomeContextProvider from '../context/home';
import PageWrapper from '../components/PageWrapper';
import SetupModal from '../components/setup-modal';
import CreateRoomModal from '../components/create-room-modal';

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
                <SetupContextProvider>
                    <HomeContextProvider>
                        {/* Add component here that checks if a home is setup */}
                        <SetupModal />
                        <CreateRoomModal />
                        <PageWrapper>
                            <Component {...pageProps} />
                        </PageWrapper>
                    </HomeContextProvider>
                </SetupContextProvider>
            </div>
        </>
    );
}

export default MyApp;
