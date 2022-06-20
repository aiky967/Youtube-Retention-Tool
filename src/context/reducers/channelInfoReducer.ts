import { CombinedActions } from '../AppContext';
import { ActionMap, Types } from '../AppTypes';

export interface IChannelInfo {
    channelId: string;
    channelName: string;
    channelThumbnail: string;
    channelSubscriberCount: number;
    channelViews: number;
    channelVideos: number;
    channelPublishedAt: string;
    isYoutubeChannel: boolean;
}

type ChannelInfoPayload = {
    [Types.GET_CHANNEL_INFO]: {
        channelInfo: IChannelInfo;
    };
};

export type ChannelInfoActions = ActionMap<ChannelInfoPayload>[keyof ActionMap<ChannelInfoPayload>];

export const channelInfoReducer = (state: IChannelInfo, action: CombinedActions) => {
    switch (action.type) {
        case Types.GET_CHANNEL_INFO:
            return action.payload.channelInfo;
        case Types.GOOGLE_SIGN_OUT:
            return undefined;
        default:
            return state;
    }
};
