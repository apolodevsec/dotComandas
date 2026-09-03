import type { AppProps } from 'next/app';
import '../styles/kds.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
