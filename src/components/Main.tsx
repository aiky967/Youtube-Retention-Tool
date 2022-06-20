import React, { useContext, useState } from 'react';
import { IoVideocamOffOutline } from 'react-icons/io5';
import { AppContext } from '../context/AppContext';
import { IVideoData } from '../context/reducers/videosReducer';
import Channel from './Analytics-Column/Channel';
import ControlButton from './Analytics-Column/ControlButton';
import RetentionGraph from './Analytics-Column/RetentionGraph';
import VideoCard from './Analytics-Column/VideoCard';
import Divider from './Search-Column/Divider';
import SearchChannelVideo from './Search-Column/SearchChannelVideo';
import VideoListCard from './Search-Column/VideoListCard';

interface MainProps {}

const Main: React.FC<MainProps> = ({}) => {
    const { state } = useContext(AppContext);
    const [videoSearchResult, setVideoSearchResult] = useState<IVideoData[]>(
        state.videos.searchedList.filter((video: IVideoData) => video.privacyStatus === 'public')
    );

    return (
        <section className='flex flex-col md:flex-row h-full md:h-screen items-center w-full'>
            <div className='flex flex-col w-full md:w-1/2 xl:w-1/3 h-full md:h-screen pt-16 pb-6 sm:pb-8 px-6 border-r border-gray-200'>
                {/* Uncomment if using search by videoIds implementation
                    <SearchForm /> 
                */}
                <SearchChannelVideo setVideoSearchResult={setVideoSearchResult} />
                <Divider text='Videos' />
                <div
                    className={`flex flex-row md:block md:flex-1 gap-4 overflow-auto md:h-full scrollbar-hide ${
                        state.videos.searchedList.length == 0 &&
                        'border-2 border-gray-300 border-dashed rounded-lg items-center'
                    }`}
                >
                    {state.videos.searchedList.length == 0 && (
                        <div className='relative h-full w-full p-12 text-center flex flex-col items-center justify-center'>
                            <IoVideocamOffOutline className='mx-auto h-12 w-12 text-gray-400' />
                            <span className='mt-2 block text-sm font-medium text-gray-900'>No videos found</span>
                        </div>
                    )}
                    {/* Uncomment if using search by videoIds implementation
                        {state.videos.searchedList
                            .slice(0)
                            .reverse()
                            .map((video: IVideoData, index: number) => (
                                <VideoListCard key={index} videoData={video} />
                            ))} 
                    */}
                    {videoSearchResult.map((video: IVideoData, index: number) => (
                        <VideoListCard key={index} videoData={video} />
                    ))}
                </div>
            </div>
            <div className='flex flex-col w-full mx-auto md:h-screen px-6 lg:px-8 xl:px-12 pb-6 md:pt-14 sm:pb-8 overflow-auto'>
                <Channel />
                {/* <TextHeader title='Video Analytics' /> */}
                <div className='space-y-4 pt-6 pb-2'>
                    <ul
                        role='list'
                        className='space-y-12 xl:grid xl:grid-cols-2 xl:items-start xl:gap-x-8 xl:gap-y-12 xl:space-y-0'
                    >
                        <li className='flex flex-col h-full'>
                            <VideoCard videoIdx={1} videoData={state.videos.analyticsList.video1} />
                        </li>
                        <li className='flex flex-col h-full'>
                            <VideoCard videoIdx={2} videoData={state.videos.analyticsList.video2} />
                        </li>
                    </ul>
                    {(state.videos.analyticsList.video1 || state.videos.analyticsList.video2) && <ControlButton />}
                </div>
                {(state.videos.analyticsList.video1 || state.videos.analyticsList.video2) && (
                    <RetentionGraph style='max-h-64 sm:max-h-80 mt-2 lg:mt-1' />
                )}
            </div>
        </section>
    );
};

export default Main;
