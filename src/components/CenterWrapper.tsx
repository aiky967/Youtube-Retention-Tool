import React, { ReactNode } from 'react';

interface CenterWrapperProps {
    children: React.ReactNode;
}

const CenterWrapper: React.FC<CenterWrapperProps> = ({ children }) => {
    return (
        <React.Fragment>
            <section className='flex flex-col md:flex-row h-screen items-center'>
                <div className='w-full mx-auto h-screen px-6 flex items-center justify-center'>
                    <div className='h-100'>{children}</div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default CenterWrapper;
