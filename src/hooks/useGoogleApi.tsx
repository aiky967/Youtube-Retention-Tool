import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Types } from '../context/AppTypes';
import { removeAllCache } from '../utils/Cache';
import { toastError } from '../utils/Toastr';

const useGoogleApi = () => {
    const { state, dispatch } = useContext(AppContext);

    const getBasicProfile = () => {
        if (typeof window !== 'undefined') {
            return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
        }
    };

    const onSignin = async () => {
        const auth = state.googleAuth.authClient;
        const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];
        if (auth) {
            await auth
                .signIn({
                    scope: scopes.join(' '),
                })
                .then(
                    (data: any) => {
                        dispatch({ type: Types.GOOGLE_SIGN_IN });
                        console.log('Sign-in successful!', data);
                    },
                    (err: any) => {
                        // console.log('Error signing in', err);
                        toastError('Error signing in!');
                    }
                );
        }
    };

    const onSignout = async () => {
        const auth = state.googleAuth.authClient;
        if (auth) {
            await auth.signOut();
            dispatch({ type: Types.GOOGLE_SIGN_OUT });
            removeAllCache();
        }
    };

    const loadYoutubeAnalyticsClient = () => {
        if (typeof window !== 'undefined') {
            gapi.client.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
            return (gapi.client as any).load('https://youtubeanalytics.googleapis.com/$discovery/rest?version=v2').then(
                () => {
                    console.log('GAPI client loaded for Youtube Analytics API');
                },
                (err: any) => {
                    console.error('Error loading GAPI client for Youtube Analytics API', err);
                }
            );
        }
    };

    const loadYoutubeClient = () => {
        if (typeof window !== 'undefined') {
            gapi.client.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
            return (gapi.client as any).load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest').then(
                () => {
                    console.log('GAPI client loaded for Youtube API');
                },
                (err: any) => {
                    console.error('Error loading GAPI client for Youtube API', err);
                }
            );
        }
    };

    return { onSignin, onSignout, loadYoutubeAnalyticsClient, loadYoutubeClient, getBasicProfile };
};

export default useGoogleApi;
