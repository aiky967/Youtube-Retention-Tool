import { NextPage } from 'next';
import React, { useContext } from 'react';
import CenterWrapper from '../components/CenterWrapper';
import GoogleSigninButton from '../components/GoogleSigninButton';
import Main from '../components/Main';
import { AppContext } from '../context/AppContext';

interface IndexProps {}

const index: NextPage<IndexProps> = ({}) => {
    const { state, dispatch } = useContext(AppContext);

    return (
        <React.Fragment>
            {state.googleAuth.isSignedIn ? (
                <>
                    <Main />
                </>
            ) : (
                <CenterWrapper>
                    <GoogleSigninButton />
                </CenterWrapper>
            )}
        </React.Fragment>
    );
};

export default index;
