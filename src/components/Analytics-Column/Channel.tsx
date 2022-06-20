import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import useYoutubeApi from '../../hooks/useYoutubeApi';
import { dFormatter, nFormatter } from '../../utils/Helpers';

interface ChannelProps {}

const Channel: React.FC<ChannelProps> = ({}) => {
    const { getChannelInfo } = useYoutubeApi();
    const { state, dispatch } = useContext(AppContext);

    useEffect(() => {
        if (!state.channelInfo) {
            getChannelInfo();
        }
    }, []);

    return (
        <div className='hidden md:flex md:items-center md:justify-between md:space-x-5 py-3'>
            <div className='flex items-start space-x-5'>
                <div className='flex-shrink-0'>
                    <div className='relative'>
                        <img
                            className='h-16 w-16 rounded-full'
                            src={state.channelInfo?.channelThumbnail}
                            alt={state.channelInfo?.channelName}
                        />
                        <span className='absolute inset-0 shadow-inner rounded-full' aria-hidden='true' />
                    </div>
                </div>
                <div className='lg:pt-1.5 line-clamp-2'>
                    <h1 className='text-2xl font-bold text-gray-900'>{state.channelInfo?.channelName}</h1>
                    <p className='hidden lg:block text-sm font-medium text-gray-500 mt-1'>
                        {state.channelInfo?.isYoutubeChannel ? (
                            <span>Joined {dFormatter(state.channelInfo?.channelPublishedAt)}</span>
                        ) : (
                            <span>You haven't create any youtube channel yet.</span>
                        )}
                    </p>
                </div>
            </div>
            <div className='flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3'>
                <dl className='text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8'>
                    <div className='flex flex-col'>
                        <dt className='order-2 lg:mt-1 text-sm lg:text-md leading-6 font-medium text-gray-500'>
                            Views
                        </dt>
                        <dd className='order-1 text-2xl lg:text-3xl font-extrabold text-almostBlack'>
                            {nFormatter(state.channelInfo?.channelViews, 1)}
                        </dd>
                    </div>
                    <div className='flex flex-col mt-10 sm:mt-0'>
                        <dt className='order-2 lg:mt-1 text-sm lg:text-md leading-6 font-medium text-gray-500'>
                            Subscribers
                        </dt>
                        <dd className='order-1 text-2xl lg:text-3xl font-extrabold text-almostBlack'>
                            {nFormatter(state.channelInfo?.channelSubscriberCount, 1)}
                        </dd>
                    </div>
                    <div className='flex flex-col mt-10 sm:mt-0'>
                        <dt className='order-2 lg:mt-1 text-sm lg:text-md leading-6 font-medium text-gray-500'>
                            Videos
                        </dt>
                        <dd className='order-1 text-2xl lg:text-3xl font-extrabold text-almostBlack'>
                            {nFormatter(state.channelInfo?.channelVideos, 1)}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};

export default Channel;
