import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <div className="p-6">
            <Component {...pageProps} />
        </div>
    );
}

export default MyApp;
