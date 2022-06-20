import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { IVideoData } from '../../context/reducers/videosReducer';
import useVideoHooks from '../../hooks/useVideoHooks';
import { dFormatter, nFormatter } from '../../utils/Helpers';
import { toastError } from '../../utils/Toastr';

interface VideoListCardProps {
    videoData: IVideoData;
}

const VideoListCard: React.FC<VideoListCardProps> = ({ videoData }) => {
    const { state, dispatch } = useContext(AppContext);
    const { addVideoToCompare, removeVideoFromCompare } = useVideoHooks();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAddVideoToCompare = async (videoData: IVideoData) => {
        setIsLoading(true);
        if (state.videos.analyticsList.video1 && state.videos.analyticsList.video2) {
            toastError('Maximum of 2 videos can be compared at a time, please remove one to add another.');
        } else {
            if (videoData.channelId === state.channelInfo.channelId) {
                await addVideoToCompare(videoData);
            }
        }
        setIsLoading(false);
    };

    const handleRemoveVideoFromCompare = async (videoId: string) => {
        await removeVideoFromCompare(videoId);
    };

    return (
        <div className='rounded-md bg-gray-50 shadow-md px-3 lg:px-6 py-5 mb-3'>
            <div className='flex flex-col xl:flex-row w-40 md:w-full'>
                <img
                    className='w-full xl:h-16 xl:w-auto sm:flex-shrink-0'
                    src={videoData.thumbnail}
                    alt={videoData.title}
                />
                <div className='xl:ml-4 w-full flex-1 lg:grid lg:content-between'>
                    <div className='mt-2 xl:mt-0 text-sm font-medium text-almostBlack line-clamp-2 align-top'>
                        {videoData.title}
                    </div>
                    <div className='mt-1 text-xs text-gray-600 sm:flex sm:flex-col lg:flex-row lg:justify-between'>
                        <div className='mt-1'>{nFormatter(Number(videoData.views), 1)} views</div>
                        <div className='mt-1'>{dFormatter(videoData.publishedAt)}</div>
                    </div>
                </div>
            </div>
            <div className='mt-2 md:mt-4'>
                {videoData.videoId === state.videos.analyticsList.video1?.videoId ||
                videoData.videoId === state.videos.analyticsList.video2?.videoId ? (
                    <button
                        type='button'
                        className={`w-full px-2 xl:px-4 py-2 text-white bg-almostBlack shadow-sm font-medium rounded-md hover:text-youtubeRed text-xs sm:text-sm`}
                        onClick={() => handleRemoveVideoFromCompare(videoData.videoId)}
                    >
                        Remove from comparison
                    </button>
                ) : (
                    <button
                        type='button'
                        className={`w-full px-2 xl:px-4 py-2 border shadow-sm font-medium rounded-md bg-white hover:bg-gray-50 text-xs sm:text-sm ${
                            videoData.channelId !== state.channelInfo?.channelId
                                ? 'cursor-not-allowed text-youtubeRed border-red-300'
                                : 'text-almostBlack border-gray-300'
                        } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                        onClick={() => handleAddVideoToCompare(videoData)}
                        disabled={isLoading}
                    >
                        {videoData.channelId !== state.channelInfo?.channelId
                            ? 'Not owned by you'
                            : isLoading
                            ? 'Loading...'
                            : 'Compare this video'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoListCard;
