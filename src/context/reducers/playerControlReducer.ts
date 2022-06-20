import { CombinedActions } from '../AppContext';
import { ActionMap, Types } from '../AppTypes';

export interface IPlayerControl {
    isPlayerReady: boolean;
    isPlayerFirstLoad: boolean;
    isPlaying: boolean;
    maxVideoDuration: number; // in seconds (e.g. 641)
    // volume: number; // decimal range 0.1 - 1
    video1Volume: number; // decimal range 0.1 - 1
    video2Volume: number; // decimal range 0.1 - 1
    currentTime: number; // float 0.01 - 1
    currentTimePercentage: number; // percentage 1 - 100
    isTimeUpdate: boolean;
    isTimePercentage: boolean;
}

type PlayerControlPayload = {
    [Types.UPDATE_PLAYER_STATE]: {
        isPlaying: boolean;
    };
    // [Types.UPDATE_PLAYER_VOLUME]: {
    //     volume: number;
    // };
    [Types.UPDATE_PLAYER_VIDEO1_VOLUME]: {
        volume: number;
    };
    [Types.UPDATE_PLAYER_VIDEO2_VOLUME]: {
        volume: number;
    };
    [Types.UPDATE_PLAYER_PROGRESS]: {
        currentTime: number;
        currentTimePercentage: number;
        isTimeUpdate: boolean;
    };
    [Types.UPDATE_PLAYER_CURRENT_TIME]: {
        currentTime: number;
        currentTimePercentage: number;
        isTimeUpdate: boolean;
    };
    [Types.UPDATE_PLAYER_ON_READY]: {
        isPlayerReady: boolean;
        isPlayerFirstLoad: boolean;
    };
    [Types.UPDATE_PLAYER_MAX_VIDEO_DURATION]: {
        maxVideoDuration: number;
    };
    [Types.UPDATE_PLAYER_IS_TIME_PERCENTAGE]: {
        isTimePercentage: boolean;
    };
    [Types.SET_PLAYER_IS_TIME_UPDATE]: undefined;
};

export type PlayerControlActions = ActionMap<PlayerControlPayload>[keyof ActionMap<PlayerControlPayload>];

export const playerControlReducer = (state: IPlayerControl, action: CombinedActions) => {
    switch (action.type) {
        case Types.UPDATE_PLAYER_STATE:
            return {
                ...state,
                isPlaying: action.payload.isPlaying,
            };
        case Types.UPDATE_PLAYER_VIDEO1_VOLUME:
            return {
                ...state,
                video1Volume: action.payload.volume,
            };
        case Types.UPDATE_PLAYER_VIDEO2_VOLUME:
            return {
                ...state,
                video2Volume: action.payload.volume,
            };
        case Types.UPDATE_PLAYER_PROGRESS:
            return {
                ...state,
                currentTime: action.payload.currentTime,
                currentTimePercentage: action.payload.currentTimePercentage,
                isTimeUpdate: action.payload.isTimeUpdate,
                isPlaying: state.isPlayerFirstLoad ? true : state.isPlaying,
                isPlayerFirstLoad: false,
            };
        case Types.UPDATE_PLAYER_CURRENT_TIME:
            return {
                ...state,
                currentTime: action.payload.currentTime,
                currentTimePercentage: action.payload.currentTimePercentage,
                isTimeUpdate: action.payload.isTimeUpdate,
            };
        case Types.UPDATE_PLAYER_ON_READY:
            return {
                ...state,
                isPlayerReady: action.payload.isPlayerReady,
                isPlayerFirstLoad: action.payload.isPlayerFirstLoad,
            };
        case Types.UPDATE_PLAYER_MAX_VIDEO_DURATION:
            return {
                ...state,
                maxVideoDuration: action.payload.maxVideoDuration,
            };
        case Types.UPDATE_PLAYER_IS_TIME_PERCENTAGE:
            return {
                ...state,
                isTimePercentage: action.payload.isTimePercentage,
            };
        case Types.SET_PLAYER_IS_TIME_UPDATE:
            return {
                ...state,
                isTimeUpdate: true,
            };
        case Types.GOOGLE_SIGN_OUT:
            return {
                ...state,
                isPlayerReady: false,
                isPlayerFirstLoad: false,
                isPlaying: false,
                maxVideoDuration: 0,
                video1Volume: 0.8,
                video2Volume: 0.8,
                currentTime: 0,
                currentTimePercentage: 0,
                isTimeUpdate: false,
                isTimePercentage: false,
            };
        default:
            return state;
    }
};
