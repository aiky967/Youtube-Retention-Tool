import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Types } from '../context/AppTypes';
import { IRetentionGraphData, IVideoData } from '../context/reducers/videosReducer';
import { CacheConstants } from '../utils/Cache';
import { round } from '../utils/Helpers';
import useYoutubeApi from './useYoutubeApi';

const useVideoHooks = () => {
    const { state, dispatch } = useContext(AppContext);
    const { getVideoBasicStats, getVideoAudienceRetention } = useYoutubeApi();

    const addVideoToCompare = async (videoData: IVideoData) => {
        dispatch({ type: Types.UPDATE_PLAYER_STATE, payload: { isPlaying: false } });
        dispatch({
            type: Types.UPDATE_PLAYER_IS_TIME_PERCENTAGE,
            payload: { isTimePercentage: false },
        });

        if (!videoData.hasOwnProperty('likes') && !videoData.hasOwnProperty('dislikes')) {
            await getVideoBasicStats(videoData.videoId, videoData.publishedAt);
        }

        if (!videoData.hasOwnProperty('audienceRetentionData')) {
            await getVideoAudienceRetention(videoData.videoId, videoData.publishedAt);
        }

        videoData = state.videos.searchedList.find((item: IVideoData) => item.videoId === videoData.videoId);

        let addedToVideo1: boolean = false;

        // Set to video 1 if there is no video 1
        if (!state.videos.analyticsList.hasOwnProperty('video1') || !state.videos.analyticsList.video1?.videoId) {
            localStorage.setItem(CacheConstants.VIDEO_1_DATA, JSON.stringify(videoData));
            dispatch({
                type: Types.ADD_VIDEO_TO_ANALYTICS,
                payload: {
                    idx: 1,
                    videoData: videoData,
                },
            });
            addedToVideo1 = true;
        }

        // Set to video 2 if there is no video 2
        if (
            (!state.videos.analyticsList.hasOwnProperty('video2') || !state.videos.analyticsList.video2?.videoId) &&
            !addedToVideo1
        ) {
            localStorage.setItem(CacheConstants.VIDEO_2_DATA, JSON.stringify(videoData));
            dispatch({
                type: Types.ADD_VIDEO_TO_ANALYTICS,
                payload: {
                    idx: 2,
                    videoData: videoData,
                },
            });
        }
    };

    const removeVideoFromCompare = async (videoId: string) => {
        dispatch({
            type: Types.UPDATE_PLAYER_PROGRESS,
            payload: {
                currentTime: 0,
                currentTimePercentage: 0,
                isTimeUpdate: true,
            },
        });
        dispatch({ type: Types.UPDATE_PLAYER_STATE, payload: { isPlaying: false } });

        const video1 = state.videos.analyticsList.video1;
        const video2 = state.videos.analyticsList.video2;

        if (video1?.videoId === videoId) {
            localStorage.removeItem(CacheConstants.VIDEO_1_DATA);
            dispatch({
                type: Types.REMOVE_VIDEO_FROM_ANALYTICS,
                payload: {
                    idx: 1,
                },
            });
        }

        if (video2?.videoId === videoId) {
            localStorage.removeItem(CacheConstants.VIDEO_2_DATA);
            dispatch({
                type: Types.REMOVE_VIDEO_FROM_ANALYTICS,
                payload: {
                    idx: 2,
                },
            });
        }
    };

    const calculateRetentionGraphByTimePercentage = async () => {
        dispatch({ type: Types.SET_PLAYER_IS_TIME_UPDATE });
        const video1: IVideoData = localStorage.getItem(CacheConstants.VIDEO_1_DATA)
            ? JSON.parse(localStorage.getItem(CacheConstants.VIDEO_1_DATA))
            : undefined;
        const video2: IVideoData = localStorage.getItem(CacheConstants.VIDEO_2_DATA)
            ? JSON.parse(localStorage.getItem(CacheConstants.VIDEO_2_DATA))
            : undefined;

        dispatch({
            type: Types.UPDATE_PLAYER_MAX_VIDEO_DURATION,
            payload: { maxVideoDuration: Math.max(video1 ? video1.duration : 0, video2 ? video2.duration : 0) },
        });

        const retentionGraphData: IRetentionGraphData[] = [];

        for (let i = 1; i <= 100; i++) {
            const currentTimeRatio = i / 100;
            const audienceRetentionDataVideo1 = video1?.audienceRetentionData.find(
                (item: Array<number>) => item[0] === currentTimeRatio
            );
            const audienceRetentionDataVideo2 = video2?.audienceRetentionData.find(
                (item: Array<number>) => item[0] === currentTimeRatio
            );

            const dataToPush: IRetentionGraphData = {
                elapsedVideoTimeRatio: currentTimeRatio - 0.01,
            };

            if (audienceRetentionDataVideo1) {
                dataToPush.audienceWatchRatioVideo1 = audienceRetentionDataVideo1[1];
                dataToPush.relativeRetentionPerformanceVideo1 = audienceRetentionDataVideo1[2];
            } else {
                dataToPush.audienceWatchRatioVideo1 = 0;
                dataToPush.relativeRetentionPerformanceVideo1 = 0;
            }

            if (audienceRetentionDataVideo2) {
                dataToPush.audienceWatchRatioVideo2 = audienceRetentionDataVideo2[1];
                dataToPush.relativeRetentionPerformanceVideo2 = audienceRetentionDataVideo2[2];
            } else {
                dataToPush.audienceWatchRatioVideo2 = 0;
                dataToPush.relativeRetentionPerformanceVideo2 = 0;
            }

            if (!audienceRetentionDataVideo1 && !audienceRetentionDataVideo2) {
                dataToPush.audienceWatchRatioVideo1 = 0;
                dataToPush.audienceWatchRatioVideo2 = 0;
                dataToPush.relativeRetentionPerformanceVideo1 = 0;
                dataToPush.relativeRetentionPerformanceVideo2 = 0;
            }

            retentionGraphData.push(dataToPush);
        }
        localStorage.setItem(CacheConstants.RETENTION_GRAPH_DATA, JSON.stringify(retentionGraphData));
        dispatch({
            type: Types.SET_RETENTION_GRAPH,
            payload: { graphData: retentionGraphData },
        });
    };

    const calculateRetentionGraphByAbsoluteTime = async () => {
        dispatch({ type: Types.SET_PLAYER_IS_TIME_UPDATE });
        const video1: IVideoData = localStorage.getItem(CacheConstants.VIDEO_1_DATA)
            ? JSON.parse(localStorage.getItem(CacheConstants.VIDEO_1_DATA))
            : undefined;
        const video2: IVideoData = localStorage.getItem(CacheConstants.VIDEO_2_DATA)
            ? JSON.parse(localStorage.getItem(CacheConstants.VIDEO_2_DATA))
            : undefined;

        const maxVideoDuration = Math.max(video1 ? video1.duration : 0, video2 ? video2.duration : 0);

        dispatch({
            type: Types.UPDATE_PLAYER_MAX_VIDEO_DURATION,
            payload: { maxVideoDuration: Math.max(video1 ? video1.duration : 0, video2 ? video2.duration : 0) },
        });

        const retentionGraphData: IRetentionGraphData[] = [];

        const isVideo1Min = video1?.duration < video2?.duration;
        const isVideo2Min = video2?.duration < video1?.duration;

        let tempTimeRatio = 0.01;

        for (let i = 1; i <= 100; i++) {
            const currentTimeRatio = i / 100;

            let audienceRetentionDataVideo1: Array<number> = [];
            let audienceRetentionDataVideo2: Array<number> = [];

            if (isVideo1Min) {
                const datapoint = Math.ceil((video1?.duration / video2?.duration) * 100);
                if (i === 1) {
                    audienceRetentionDataVideo1 = video1?.audienceRetentionData.find(
                        (item: Array<number>) => item[0] === currentTimeRatio
                    );
                }
                if (datapoint >= i && i !== 1) {
                    const addTimeFloat = round(maxVideoDuration / video1?.duration / 100, 5);
                    tempTimeRatio = tempTimeRatio + addTimeFloat;
                    audienceRetentionDataVideo1 = video1?.audienceRetentionData.find(
                        (item: Array<number>) => item[0] === round(tempTimeRatio, 2)
                    );
                }
                audienceRetentionDataVideo2 = video2?.audienceRetentionData.find(
                    (item: Array<number>) => item[0] === currentTimeRatio
                );
            }

            if (isVideo2Min) {
                const datapoint = Math.ceil((video2?.duration / video1?.duration) * 100);
                if (i === 1) {
                    audienceRetentionDataVideo2 = video2?.audienceRetentionData.find(
                        (item: Array<number>) => item[0] === currentTimeRatio
                    );
                }
                if (datapoint >= i && i !== 1) {
                    const addTimeFloat = round(maxVideoDuration / video2?.duration / 100, 5);
                    tempTimeRatio = tempTimeRatio + addTimeFloat;
                    audienceRetentionDataVideo2 = video2?.audienceRetentionData.find(
                        (item: Array<number>) => item[0] === round(tempTimeRatio, 2)
                    );
                }
                audienceRetentionDataVideo1 = video1?.audienceRetentionData.find(
                    (item: Array<number>) => item[0] === currentTimeRatio
                );
            }

            if (!isVideo1Min && !isVideo2Min) {
                audienceRetentionDataVideo1 = video1?.audienceRetentionData.find(
                    (item: Array<number>) => item[0] === currentTimeRatio
                );
                audienceRetentionDataVideo2 = video2?.audienceRetentionData.find(
                    (item: Array<number>) => item[0] === currentTimeRatio
                );
            }

            const dataToPush: IRetentionGraphData = {
                elapsedVideoTimeRatio: currentTimeRatio - 0.01,
            };

            if (audienceRetentionDataVideo1) {
                dataToPush.audienceWatchRatioVideo1 = audienceRetentionDataVideo1[1];
                dataToPush.relativeRetentionPerformanceVideo1 = audienceRetentionDataVideo1[2];
            } else {
                dataToPush.audienceWatchRatioVideo1 = 0;
                dataToPush.relativeRetentionPerformanceVideo1 = 0;
            }

            if (audienceRetentionDataVideo2) {
                dataToPush.audienceWatchRatioVideo2 = audienceRetentionDataVideo2[1];
                dataToPush.relativeRetentionPerformanceVideo2 = audienceRetentionDataVideo2[2];
            } else {
                dataToPush.audienceWatchRatioVideo2 = 0;
                dataToPush.relativeRetentionPerformanceVideo2 = 0;
            }

            if (!audienceRetentionDataVideo1 && !audienceRetentionDataVideo2) {
                dataToPush.audienceWatchRatioVideo1 = 0;
                dataToPush.audienceWatchRatioVideo2 = 0;
                dataToPush.relativeRetentionPerformanceVideo1 = 0;
                dataToPush.relativeRetentionPerformanceVideo2 = 0;
            }

            retentionGraphData.push(dataToPush);
        }
        localStorage.setItem(CacheConstants.RETENTION_GRAPH_DATA, JSON.stringify(retentionGraphData));
        dispatch({
            type: Types.SET_RETENTION_GRAPH,
            payload: { graphData: retentionGraphData },
        });
    };

    return {
        addVideoToCompare,
        removeVideoFromCompare,
        calculateRetentionGraphByTimePercentage,
        calculateRetentionGraphByAbsoluteTime,
    };
};

export default useVideoHooks;
