import Head from 'next/head';
import Script from 'next/script';
import React, { useContext } from 'react';
import { FaSignOutAlt, FaYoutube } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import { Types } from '../context/AppTypes';
import useGoogleApi from '../hooks/useGoogleApi';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
    const { state, dispatch } = useContext(AppContext);
    const { onSignout, loadYoutubeClient, loadYoutubeAnalyticsClient } = useGoogleApi();

    const loadGoogleClient = () => {
        if (typeof window !== 'undefined') {
            gapi.load('client:auth2', () => {
                gapi.auth2
                    .init({
                        client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH2_CLIENT_ID,
                        scope: 'https://www.googleapis.com/auth/youtube.readonly',
                        fetch_basic_profile: false,
                    })
                    .then(() => {
                        console.log('Google API loaded');
                        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                        dispatch({
                            type: Types.SET_GOOGLE_AUTH,
                            payload: {
                                authClient: gapi.auth2.getAuthInstance(),
                                isSignedIn: gapi.auth2.getAuthInstance().isSignedIn.get(),
                            },
                        });
                    })
                    .then(() => {
                        loadYoutubeAnalyticsClient();
                        loadYoutubeClient();
                    });
            });
        }
    };

    const updateSigninStatus = () => {
        const user = gapi.auth2.getAuthInstance().currentUser.get();
        const isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.readonly');
        if (isAuthorized) {
            dispatch({
                type: Types.UPDATE_GOOGLE_IS_SIGNED_IN,
                payload: {
                    isSignedIn: gapi.auth2.getAuthInstance().isSignedIn.get(),
                },
            });
        } else {
            onSignout();
        }
    };

    return (
        <React.Fragment>
            <Script src='https://apis.google.com/js/platform.js' />
            <Script src='https://apis.google.com/js/api.js' onLoad={loadGoogleClient} />
            <Head>
                <meta charSet='utf-8' />
                <title>YT Retention Tools</title>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='icon' href='/favicon.ico' />
                <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
                <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
                <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
                <link rel='icon' type='image/png' sizes='192x192' href='/android-chrome-192x192.png' />
                <link rel='icon' type='image/png' sizes='512x512' href='/android-chrome-512x512.png' />

                <meta
                    name='description'
                    content='Compare audience retention data for your youtube channel videos. Created by Nabil Farhan.'
                />
                <meta name='keywords' content='YT, Youtube, Retention, Tools' />
                <meta name='author' content='Nabil Farhan' />

                {/* Open Graph / Facebook */}
                <meta property='og:type' content='website' />
                <meta property='og:title' content='YT Retention Tools' />
                <meta
                    property='og:description'
                    content='Compare audience retention data for your youtube channel videos. Created by Nabil Farhan.'
                />

                {/* Twitter */}
                <meta name='twitter:creator' content={`@nabilfarhann`} key='twhandle' />
                <meta property='twitter:card' content='summary_large_image' />
                <meta property='twitter:url' content='https://twitter.com/nabilfarhann' />
                <meta property='twitter:title' content='YT Retention Tools' />
                <meta
                    property='twitter:description'
                    content='Compare audience retention data for your youtube channel videos. Created by Nabil Farhan.'
                />

                <meta name='google-signin-client_id' content={process.env.NEXT_PUBLIC_GOOGLE_OAUTH2_CLIENT_ID} />
            </Head>

            <div className='absolute top-0 w-full border-b border-gray-200 bg-white z-50'>
                <div className='max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8'>
                    <div className='sm:text-center sm:px-16'>
                        <div className='flex sm:justify-center items-center'>
                            <a href='/' className='flex font-medium sm:justify-center items-center'>
                                <FaYoutube className='h-6 w-6 items-center text-youtubeRed' />
                                <span className='ml-1.5 sm:ml-3 text-almostBlack'>YT Retention Tools</span>
                            </a>
                        </div>
                    </div>
                    {state.googleAuth.isSignedIn && (
                        <div className='absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start'>
                            <button
                                type='button'
                                onClick={onSignout}
                                className='flex p-2 items-center text-almostBlack hover:text-youtubeRed'
                            >
                                <span className='sr-only'>Dismiss</span>
                                <FaSignOutAlt className='h-4 w-4' aria-hidden='true' />
                                <span className='ml-2'>Sign out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Navbar;
