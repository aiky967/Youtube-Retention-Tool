import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import useGoogleApi from '../hooks/useGoogleApi';

interface GoogleSigninButtonProps {}

const GoogleSigninButton: React.FC<GoogleSigninButtonProps> = ({}) => {
    const { onSignin } = useGoogleApi();
    return (
        <React.Fragment>
            <button
                className='w-full inline-flex justify-center py-2 px-4
                            border border-gray-300 rounded-md shadow-sm 
                            bg-white hover:bg-gray-50 text-almostBlack'
                type='button'
                onClick={onSignin}
            >
                <FcGoogle className='h-6 w-6 mr-2' />
                <span>Sign in with Google</span>
            </button>
        </React.Fragment>
    );
};

export default GoogleSigninButton;
