import dynamic from 'next/dynamic';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from '../context/AppContext';
import '../styles.css';
import { toastrSettings } from '../utils/Toastr';

const Navbar = dynamic(() => import('../components/Navbar'), { ssr: false });

function MyApp({ Component, pageProps }) {
    return (
        <AppProvider>
            <Toaster position='top-right' toastOptions={toastrSettings} containerStyle={{ top: 30 }} />
            <Navbar />
            <Component {...pageProps} />
        </AppProvider>
    );
}

export default MyApp;
