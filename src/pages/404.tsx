import { NextPage } from 'next';
import CenterWrapper from '../components/CenterWrapper';

interface Custom404Props {}

const Custom404: NextPage<Custom404Props> = ({}) => {
    return (
        <CenterWrapper>
            <main className='flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='py-16'>
                    <div className='text-center'>
                        <p className='text-sm font-semibold text-youtubeRed uppercase tracking-wide'>404 error</p>
                        <h1 className='mt-2 text-4xl font-extrabold text-almostBlack tracking-tight sm:text-5xl'>
                            Page not found
                        </h1>
                        <div className='mt-6'>
                            <a href='/' className='text-base font-medium text-youtubeRed'>
                                Go back home<span aria-hidden='true'> &rarr;</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center space-x-4'>
                    <span className='text-sm font-medium text-almostBlack'>
                        Made with<span className='px-2'>❤️</span> by Akash Kesharwani
                    </span>
                </div>
            </main>
        </CenterWrapper>
    );
};

export default Custom404;
