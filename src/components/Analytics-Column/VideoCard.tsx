import React, { useContext, useEffect, useRef } from 'react';
import { AiOutlineVideoCameraAdd } from 'react-icons/ai';
import { RiDeleteBin2Line } from 'react-icons/ri';
import ReactPlayer from 'react-player';
import { AppContext } from '../../context/AppContext';
import { Types } from '../../context/AppTypes';
import { IVideoData } from '../../context/reducers/videosReducer';
import useVideoHooks from '../../hooks/useVideoHooks';
import { dFormatter, nFormatter, secondsToTimestamp } from '../../utils/Helpers';

interface VideoCardProps {
    videoIdx: number;
    videoData?: IVideoData;
}

const VideoCard: React.FC<VideoCardProps> = ({ videoIdx, videoData }) => {
    const { state, dispatch } = useContext(AppContext);
    const { removeVideoFromCompare } = useVideoHooks();
    const player = useRef(null);

    useEffect(() => {
        if (videoData && state.playerControl.isPlayerReady && state.playerControl.isTimeUpdate) {
            const seekTime = (state.playerControl.currentTime / 1) * state.playerControl.maxVideoDuration;
            const time = seekTime / state.playerControl.maxVideoDuration;
            const seekTimePercentage = (time / 1) * videoData.duration;
            if (state.playerControl.isTimePercentage) {
                player.current?.seekTo(seekTimePercentage);
            } else {
                player.current?.seekTo(seekTime);
            }
            dispatch({
                type: Types.UPDATE_PLAYER_CURRENT_TIME,
                payload: { currentTime: time, currentTimePercentage: time * 100, isTimeUpdate: false },
            });
        }
    }, [state.playerControl.isTimeUpdate, state.playerControl.isTimePercentage]);

    useEffect(() => {
        if (videoData && state.playerControl.isPlayerReady && state.playerControl.isPlaying) {
            const tempTime: Array<number> = [];
            const interval = setInterval(() => {
                const duration = player.current?.getDuration() || 0;
                if (
                    Math.ceil(duration) === state.playerControl.maxVideoDuration ||
                    Math.floor(duration) === state.playerControl.maxVideoDuration
                ) {
                    const elapsed_sec = player.current.getCurrentTime();
                    const time = elapsed_sec / duration;
                    dispatch({
                        type: Types.UPDATE_PLAYER_CURRENT_TIME,
                        payload: { currentTime: time, currentTimePercentage: time * 100, isTimeUpdate: false },
                    });
                    const filterDuplicate = tempTime.filter((v) => v === time).length;
                    if (time == 1 || filterDuplicate >= 10) {
                        dispatch({
                            type: Types.UPDATE_PLAYER_PROGRESS,
                            payload: {
                                currentTime: 1,
                                currentTimePercentage: 100,
                                isTimeUpdate: true,
                            },
                        });
                        dispatch({
                            type: Types.UPDATE_PLAYER_STATE,
                            payload: { isPlaying: false },
                        });
                    }
                    tempTime.push(time);
                }
            }, 100);

            return () => {
                clearInterval(interval);
            };
        }
    }, [state.playerControl.isPlaying]);

    const handleOnReady = () => {
        dispatch({ type: Types.UPDATE_PLAYER_ON_READY, payload: { isPlayerReady: true, isPlayerFirstLoad: true } });

        const video1 = state.videos.analyticsList.video1;
        const video2 = state.videos.analyticsList.video2;

        dispatch({
            type: Types.UPDATE_PLAYER_MAX_VIDEO_DURATION,
            payload: { maxVideoDuration: Math.max(video1 ? video1.duration : 0, video2 ? video2.duration : 0) },
        });
    };

    const getPlaybackRate = state.playerControl.isTimePercentage
        ? videoData?.duration === state.playerControl.maxVideoDuration
            ? 1
            : videoData?.duration / state.playerControl.maxVideoDuration
        : 1;

    const handleRemoveVideoFromCompare = async (videoId: string) => {
        await removeVideoFromCompare(videoId);
    };

    return (
        <React.Fragment>
            <div className='space-y-4 sm:grid sm:grid-cols-4 md:gap-3 sm:space-y-0 xl:gap-5'>
                <div className='aspect-w-3 aspect-h-2 sm:aspect-w-3 sm:aspect-h-4'>
                    <img
                        className='object-cover shadow-lg rounded-lg'
                        src={videoData?.thumbnail || 'https://ik.imagekit.io/footykids/Others/youtube-loader_lIaNS1pv2'}
                        alt=''
                    />
                </div>
                <div className='sm:col-span-3'>
                    <div className='space-y-2 px-3 xl:px-0'>
                        <div className='leading-6 space-y-1'>
                            <div className='flex flex-row justify-between mb-2'>
                                <h3 className='text-md font-bold text-almostBlack'>Video {videoIdx}</h3>
                                {videoData?.videoId && (
                                    <button
                                        type='button'
                                        className='px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50'
                                        onClick={() => handleRemoveVideoFromCompare(videoData.videoId)}
                                    >
                                        <div className='flex items-center'>
                                            <RiDeleteBin2Line className='text-red-500 mr-2' />
                                            <span className='text-xs text-almostBlack font-medium'>Remove</span>
                                        </div>
                                    </button>
                                )}
                            </div>
                            {videoData?.title ? (
                                <p className='text-almostBlack line-clamp-2 text-sm font-medium'>{videoData.title}</p>
                            ) : (
                                <div className='loading h-6 w-full rounded-md'></div>
                            )}
                        </div>
                        {videoData?.publishedAt ? (
                            <div className='text-xs'>
                                <p className='text-gray-600'>Published {dFormatter('2012-10-01T15:27:35Z')}</p>
                            </div>
                        ) : (
                            <div className='loading h-4 w-36 rounded-md'></div>
                        )}
                    </div>
                </div>
            </div>
            {videoData ? (
                <div>
                    <div>
                        <dl className='px-3 xl:px-4 mt-5 grid grid-cols-3 gap-4'>
                            <div className='overflow-hidden'>
                                <dt className='text-xs sm:text-sm font-medium text-gray-500 truncate'>Views</dt>
                                <dd className='mt-1 text-md sm:text-xl font-semibold text-almostBlack'>
                                    {nFormatter(Number(videoData.views), 1)}
                                </dd>
                            </div>
                            <div className='overflow-hidden'>
                                <dt className='text-xs sm:text-sm font-medium text-gray-500 truncate'>Likes</dt>
                                <dd className='mt-1 text-md sm:text-xl font-semibold text-almostBlack'>
                                    {nFormatter(Number(videoData.likes), 1)}
                                </dd>
                            </div>
                            <div className='overflow-hidden'>
                                <dt className='text-xs sm:text-sm font-medium text-gray-500 truncate'>Dislikes</dt>
                                <dd className='mt-1 text-md sm:text-xl font-semibold text-almostBlack'>
                                    {nFormatter(Number(videoData.dislikes), 1)}
                                </dd>
                            </div>
                            <div className='overflow-hidden'>
                                <dt className='text-xs sm:text-sm font-medium text-gray-500 truncate'>Duration</dt>
                                <dd className='mt-1 text-md sm:text-xl font-semibold text-almostBlack'>
                                    {/* {nFormatter(Number(videoData.comments), 1)} */}
                                    {secondsToTimestamp(videoData.duration)}
                                </dd>
                            </div>
                            <div className='overflow-hidden'>
                                <dt className='text-xs sm:text-sm font-medium text-gray-500 truncate'>
                                    Est. minute watched
                                </dt>
                                <dd className='mt-1 text-md sm:text-xl font-semibold text-almostBlack'>
                                    {videoData.estimatedMinutesWatched}
                                </dd>
                            </div>
                            <div className='overflow-hidden'>
                                <dt className='text-xs sm:text-sm font-medium text-gray-500 truncate'>
                                    Avg. view duration
                                </dt>
                                <dd className='mt-1 text-md sm:text-xl font-semibold text-almostBlack'>
                                    {secondsToTimestamp(videoData.averageViewDuration)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className='mt-8 w-full'>
                        <ReactPlayer
                            ref={player}
                            url={`https://www.youtube.com/watch?v=${videoData.videoId}`}
                            width='100%'
                            controls={false}
                            loop={false}
                            playing={state.playerControl.isPlaying}
                            onReady={handleOnReady}
                            style={{ pointerEvents: 'none' }}
                            volume={
                                videoIdx === 1 ? state.playerControl.video1Volume : state.playerControl.video2Volume
                            }
                            playbackRate={getPlaybackRate}
                        />
                    </div>
                </div>
            ) : (
                <div className='flex-1 mt-5 border-2 border-gray-300 border-dashed rounded-lg items-center'>
                    <div
                        className={`relative w-full p-12 text-center flex flex-col items-center justify-center ${
                            !state.videos.analyticsList.video1 && !state.videos.analyticsList.video2 ? 'h-96' : 'h-full'
                        }`}
                    >
                        <AiOutlineVideoCameraAdd className='mx-auto h-12 w-12 text-gray-400' />
                        <span className='mt-2 block text-sm font-medium text-gray-900'>Add video to compare</span>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default VideoCard;
