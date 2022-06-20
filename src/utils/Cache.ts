export enum CacheConstants {
    USER_CHANNEL_INFO = 'USER_CHANNEL_INFO',
    SEARCHED_VIDEO_LIST = 'SEARCHED_VIDEO_LIST',
    VIDEO_1_DATA = 'VIDEO_1_DATA',
    VIDEO_2_DATA = 'VIDEO_2_DATA',
    RETENTION_GRAPH_DATA = 'RETENTION_GRAPH_DATA',
}

export const removeAllCache = () => {
    localStorage.clear();
};
