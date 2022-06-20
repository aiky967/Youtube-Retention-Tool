import dayjs from 'dayjs';
import * as duration from 'duration-fns';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Types } from '../context/AppTypes';
import { IChannelInfo } from '../context/reducers/channelInfoReducer';
import { IVideoData } from '../context/reducers/videosReducer';
import { CacheConstants } from '../utils/Cache';
import { isEmpty } from '../utils/Helpers';
import { toastError } from '../utils/Toastr';
import useGoogleApi from './useGoogleApi';

const useYoutubeApi = () => {
    const currentDate = dayjs().format('YYYY-MM-DD');
    const { state, dispatch } = useContext(AppContext);
    const { getBasicProfile } = useGoogleApi();

    const getVideos = async (videoIds: string) => {
        const searchedList: IVideoData[] = state.videos.searchedList;
        const requestIds = videoIds.split(',');
        const youtubeSearchIds = [];

        if (searchedList) {
            requestIds.forEach((id: string) => {
                const exist = searchedList.find((item: IVideoData) => item.videoId === id);
                if (exist) {
                    searchedList.push(
                        ...searchedList.splice(
                            searchedList.findIndex((v) => v.videoId == exist.videoId),
                            1
                        )
                    );
                } else {
                    youtubeSearchIds.push(id);
                }
            });
            localStorage.setItem(CacheConstants.SEARCHED_VIDEO_LIST, JSON.stringify(searchedList));
            dispatch({ type: Types.SEARCH_VIDEOS, payload: { searchedList: searchedList } });
        }

        if (youtubeSearchIds.length > 0) {
            gapi.client['youtube'].videos
                .list({
                    part: ['snippet,contentDetails,statistics,status'],
                    id: youtubeSearchIds,
                })
                .then(
                    (response: any) => {
                        console.log('(ALERT! API CALLED!) GET Videos');
                        if (response && response.result.pageInfo.totalResults > 0) {
                            response.result.items.map((item: any) => {
                                searchedList.push({
                                    videoId: item.id,
                                    channelId: item.snippet.channelId,
                                    thumbnail: item.snippet.thumbnails.medium.url,
                                    title: item.snippet.title,
                                    publishedAt: item.snippet.publishedAt,
                                    views: item.statistics.viewCount,
                                    duration: duration.toSeconds(item.contentDetails.duration),
                                    privacyStatus: item.status.privacyStatus,
                                });
                            });
                            localStorage.setItem(CacheConstants.SEARCHED_VIDEO_LIST, JSON.stringify(searchedList));
                            dispatch({ type: Types.SEARCH_VIDEOS, payload: { searchedList: searchedList } });
                        } else {
                            toastError('No videos found');
                        }
                    },
                    (err: any) => {
                        toastError('(Youtube API) Error on getting videos');
                    }
                );
        }
    };

    const getChannelInfo = async () => {
        if (gapi.client['youtube']?.channels && isEmpty(state.channelInfo)) {
            await gapi.client['youtube'].channels
                .list({
                    part: ['snippet,contentDetails,statistics'],
                    maxResults: 10,
                    mine: true,
                })
                .then(
                    (response: any) => {
                        console.log('(ALERT! API CALLED!) GET ChannelInfo');
                        if (response && response.result.pageInfo.totalResults > 0) {
                            const channelInfo: IChannelInfo = {
                                channelId: response.result.items[0].id,
                                channelName: response.result.items[0].snippet.title,
                                channelThumbnail: response.result.items[0].snippet.thumbnails.high.url,
                                channelSubscriberCount: response.result.items[0].statistics.subscriberCount,
                                channelViews: response.result.items[0].statistics.viewCount,
                                channelVideos: response.result.items[0].statistics.videoCount,
                                channelPublishedAt: response.result.items[0].snippet.publishedAt,
                                isYoutubeChannel: true,
                            };
                            localStorage.setItem(CacheConstants.USER_CHANNEL_INFO, JSON.stringify(channelInfo));
                            dispatch({ type: Types.GET_CHANNEL_INFO, payload: { channelInfo } });
                        } else {
                            const profile = getBasicProfile();
                            const channelInfo: IChannelInfo = {
                                channelId: '',
                                channelName: profile.getEmail(),
                                channelThumbnail:
                                    'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
                                channelSubscriberCount: 0,
                                channelViews: 0,
                                channelVideos: 0,
                                channelPublishedAt: '',
                                isYoutubeChannel: false,
                            };
                            localStorage.setItem(CacheConstants.USER_CHANNEL_INFO, JSON.stringify(channelInfo));
                            dispatch({ type: Types.GET_CHANNEL_INFO, payload: { channelInfo: channelInfo } });
                        }
                        // Remove below line if using search by videoIds implementation
                        if (state.videos.searchedList.length === 0) {
                            getChannelVideos();
                        }
                    },
                    (err: any) => {
                        toastError('(Youtube API) Error on getting channel info');
                    }
                );
        } else {
        }
    };

    const getChannelVideos = async () => {
        await gapi.client['youtube'].search
            .list({
                part: ['snippet'],
                forMine: true,
                maxResults: 50,
                order: 'date',
                type: ['video'],
            })
            .then(
                (response: any) => {
                    console.log('(ALERT! API CALLED!) GET Channel videos');
                    const items = response.result.items;
                    if (items) {
                        const videoIds = items.map((item: any) => item.id.videoId).join(',');
                        getVideos(videoIds);
                    } else {
                        toastError('No videos found for your channel');
                    }
                },
                (err: any) => {
                    toastError('(Youtube API) Error on getting channel videos');
                }
            );
    };

    const getVideoBasicStats = async (videoId: string, videoPublishedAt: string) => {
        await gapi.client['youtubeAnalytics'].reports
            .query({
                endDate: currentDate,
                filters: `video==${videoId}`,
                ids: 'channel==MINE',
                metrics: 'views,comments,likes,dislikes,estimatedMinutesWatched,averageViewDuration',
                startDate: dayjs(videoPublishedAt).subtract(1, 'day').format('YYYY-MM-DD'),
            })
            .then(
                (response: any) => {
                    console.log('(ALERT! API CALLED!) GET Video basic stats');
                    const newSearchedList = state.videos.searchedList.map((item: IVideoData) => {
                        if (item.videoId === videoId) {
                            item.views = response.result.rows[0][0];
                            item.comments = response.result.rows[0][1];
                            item.likes = response.result.rows[0][2];
                            item.dislikes = response.result.rows[0][3];
                            item.estimatedMinutesWatched = response.result.rows[0][4];
                            item.averageViewDuration = response.result.rows[0][5];
                        }
                        return item;
                    });
                    localStorage.setItem(CacheConstants.SEARCHED_VIDEO_LIST, JSON.stringify(newSearchedList));
                    dispatch({ type: Types.SEARCH_VIDEOS, payload: { searchedList: newSearchedList } });
                },
                (err: any) => {
                    console.error('Execute error', err);
                    toastError('(Youtube API) Error on getting video stats');
                }
            );
    };

    const getVideoAudienceRetention = async (videoId: string, videoPublishedAt: string) => {
        await gapi.client['youtubeAnalytics'].reports
            .query({
                dimensions: 'elapsedVideoTimeRatio',
                endDate: currentDate,
                filters: `video==${videoId};audienceType==ORGANIC`,
                ids: 'channel==MINE',
                metrics: 'audienceWatchRatio,relativeRetentionPerformance',
                startDate: dayjs(videoPublishedAt).subtract(1, 'day').format('YYYY-MM-DD'),
            })
            .then(
                (response: any) => {
                    console.log('(ALERT! API CALLED!) GET Video audience retention');
                    const newSearchedList = state.videos.searchedList.map((item: IVideoData) => {
                        if (item.videoId === videoId) {
                            item.audienceRetentionData = response.result.rows;
                        }
                        return item;
                    });
                    localStorage.setItem(CacheConstants.SEARCHED_VIDEO_LIST, JSON.stringify(newSearchedList));
                    dispatch({ type: Types.SEARCH_VIDEOS, payload: { searchedList: newSearchedList } });
                },
                (err: any) => {
                    console.error('Execute error', err);
                    toastError('(Youtube API) Error on getting video audience retention');
                }
            );
    };

    return { getVideos, getChannelInfo, getChannelVideos, getVideoBasicStats, getVideoAudienceRetention };
};

export default useYoutubeApi;
