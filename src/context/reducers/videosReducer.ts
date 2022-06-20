import { CombinedActions } from '../AppContext';
import { ActionMap, Types } from '../AppTypes';

export interface IVideos {
    isSearched: boolean;
    searchedList: IVideoData[];
    analyticsList: IAnalyticsVideoData;
    retentionGraph?: IRetentionGraphData[];
}

export interface IAnalyticsVideoData {
    video1?: IVideoData;
    video2?: IVideoData;
}

export interface IVideoData {
    videoId: string;
    channelId: string;
    thumbnail: string;
    title: string;
    publishedAt: string; // timestamp 2015-12-27T05:19:05Z
    views: number | string;
    duration: number; // seconds (e.g. 641)
    likes?: number | string;
    dislikes?: number | string;
    comments?: number | string;
    estimatedMinutesWatched?: number; // minute
    averageViewDuration?: number; // seconds
    audienceRetentionData?: Array<Array<number>>;
    privacyStatus?: string;
}

export interface IRetentionGraphData {
    elapsedVideoTimeRatio: number;
    audienceWatchRatioVideo1?: number;
    relativeRetentionPerformanceVideo1?: number;
    audienceWatchRatioVideo2?: number;
    relativeRetentionPerformanceVideo2?: number;
}

type VideosPayload = {
    [Types.SEARCH_VIDEOS]: {
        searchedList: IVideoData[];
    };
    [Types.ADD_VIDEO_TO_ANALYTICS]: {
        idx: number;
        videoData: IVideoData;
    };
    [Types.REMOVE_VIDEO_FROM_ANALYTICS]: {
        idx: number;
    };
    [Types.REMOVE_ALL_VIDEO_FROM_ANALYTICS]: undefined;
    [Types.SET_RETENTION_GRAPH]: {
        graphData: IRetentionGraphData[];
    };
    [Types.REMOVE_RETENTION_GRAPH]: undefined;
};

export type VideosActions = ActionMap<VideosPayload>[keyof ActionMap<VideosPayload>];

export const videosReducer = (state: IVideos, action: CombinedActions) => {
    switch (action.type) {
        case Types.SEARCH_VIDEOS:
            return {
                ...state,
                isSearched: true,
                searchedList: action.payload.searchedList,
            };
        case Types.ADD_VIDEO_TO_ANALYTICS:
            return {
                ...state,
                analyticsList: {
                    video1: action.payload.idx === 1 ? action.payload.videoData : state.analyticsList.video1,
                    video2: action.payload.idx === 2 ? action.payload.videoData : state.analyticsList.video2,
                },
            };
        case Types.REMOVE_VIDEO_FROM_ANALYTICS:
            return {
                ...state,
                analyticsList: {
                    video1: action.payload.idx === 1 ? undefined : state.analyticsList.video1,
                    video2: action.payload.idx === 2 ? undefined : state.analyticsList.video2,
                },
            };
        case Types.REMOVE_ALL_VIDEO_FROM_ANALYTICS:
            return {
                ...state,
                analyticsList: {
                    video1: undefined,
                    video2: undefined,
                },
            };
        case Types.SET_RETENTION_GRAPH:
            return {
                ...state,
                retentionGraph: action.payload.graphData,
            };
        case Types.REMOVE_RETENTION_GRAPH:
            return {
                ...state,
                retentionGraph: undefined,
            };
        case Types.GOOGLE_SIGN_OUT:
            return {
                ...state,
                isSearched: false,
                searchedList: [],
                analyticsList: {
                    video1: undefined,
                    video2: undefined,
                },
                retentionGraph: undefined,
            }
        default:
            return state;
    }
};
