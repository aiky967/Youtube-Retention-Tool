import React from 'react';
import CenterWrapper from '../components/CenterWrapper';
import useGoogleApi from '../hooks/useGoogleApi';

interface MaintenanceProps {}

const Maintenance: React.FC<MaintenanceProps> = ({}) => {
    // const { signout } = useGoogleApi();

    return (
        <CenterWrapper>
            <main className='flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='py-16'>
                    <div className='text-center'>
                        <p className='text-sm font-semibold text-youtubeRed uppercase tracking-wide'>
                            We are improving our website.
                        </p>
                        <h1 className='mt-2 text-4xl font-extrabold text-almostBlack tracking-tight sm:text-5xl'>
                            Under maintenance
                        </h1>
                        <div className='mt-6'>
                            <span className='text-base font-medium text-gray-500'>
                                We'll be back in a few hours with new cool features.
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </CenterWrapper>
    );
};

export default Maintenance;
