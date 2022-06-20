import { createContext, useReducer } from 'react';
import { CacheConstants } from '../utils/Cache';
import { ChannelInfoActions, channelInfoReducer, IChannelInfo } from './reducers/channelInfoReducer';
import { GoogleAuthActions, googleAuthReducer, IGoogleAuth } from './reducers/googleAuthReducer';
import { IPlayerControl, PlayerControlActions, playerControlReducer } from './reducers/playerControlReducer';
import { IVideos, VideosActions, videosReducer } from './reducers/videosReducer';

interface AppContextProps {
    googleAuth: IGoogleAuth;
    channelInfo: IChannelInfo;
    playerControl: IPlayerControl;
    videos: IVideos;
}

const initialState: AppContextProps = {
    googleAuth: {
        authClient: undefined,
        isSignedIn: false,
    },
    channelInfo:
        typeof window !== 'undefined'
            ? localStorage.getItem(CacheConstants.USER_CHANNEL_INFO)
                ? JSON.parse(localStorage.getItem(CacheConstants.USER_CHANNEL_INFO))
                : undefined
            : undefined,
    playerControl: {
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
    },
    videos: {
        isSearched: false,
        searchedList:
            typeof window !== 'undefined'
                ? localStorage.getItem(CacheConstants.SEARCHED_VIDEO_LIST)
                    ? JSON.parse(localStorage.getItem(CacheConstants.SEARCHED_VIDEO_LIST))
                    : []
                : [],
        analyticsList: {
            video1:
                typeof window !== 'undefined'
                    ? localStorage.getItem(CacheConstants.VIDEO_1_DATA)
                        ? JSON.parse(localStorage.getItem(CacheConstants.VIDEO_1_DATA))
                        : undefined
                    : undefined,
            video2:
                typeof window !== 'undefined'
                    ? localStorage.getItem(CacheConstants.VIDEO_2_DATA)
                        ? JSON.parse(localStorage.getItem(CacheConstants.VIDEO_2_DATA))
                        : undefined
                    : undefined,
        },
    },
};

export type CombinedActions = GoogleAuthActions | ChannelInfoActions | PlayerControlActions | VideosActions;

const AppContext = createContext<{
    state: AppContextProps;
    dispatch: React.Dispatch<CombinedActions>;
}>({
    state: initialState,
    dispatch: () => null,
});

const AppReducer = ({ googleAuth, channelInfo, playerControl, videos }: AppContextProps, action: CombinedActions) => ({
    googleAuth: googleAuthReducer(googleAuth, action),
    channelInfo: channelInfoReducer(channelInfo, action),
    playerControl: playerControlReducer(playerControl, action),
    videos: videosReducer(videos, action),
});

const AppProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);
    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
