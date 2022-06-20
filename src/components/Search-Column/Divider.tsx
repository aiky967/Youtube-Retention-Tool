import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Types } from '../../context/AppTypes';
import { CacheConstants } from '../../utils/Cache';

interface DividerProps {
    text: string;
}

const Divider: React.FC<DividerProps> = ({ text }) => {
    const { state, dispatch } = useContext(AppContext);

    const handleClearSearchResult = () => {
        localStorage.removeItem(CacheConstants.SEARCHED_VIDEO_LIST);
        localStorage.removeItem(CacheConstants.VIDEO_1_DATA);
        localStorage.removeItem(CacheConstants.VIDEO_2_DATA);
        localStorage.removeItem(CacheConstants.RETENTION_GRAPH_DATA);

        dispatch({ type: Types.SEARCH_VIDEOS, payload: { searchedList: [] } });
        dispatch({ type: Types.REMOVE_ALL_VIDEO_FROM_ANALYTICS });
        dispatch({ type: Types.REMOVE_RETENTION_GRAPH });
    };

    return (
        <React.Fragment>
            <div className='relative py-5 sm:py-7'>
                <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                    <div className='w-full border-t border-gray-300' />
                </div>
                <div className='relative flex justify-center'>
                    <span className='px-3 bg-white text-lg font-medium text-gray-900'>{text}</span>
                </div>
            </div>
            {/* Uncomment if using search by videoIds implementation
                {state.videos.searchedList.length > 0 && (
                    <div className='relative flex flex-row justify-end items-center -mt-5 sm:-mt-7 pb-5'>
                        <button
                            type='button'
                            className='text-almostBlack text-sm font-medium hover:text-youtubeRed'
                            onClick={handleClearSearchResult}
                        >
                            Clear search result
                        </button>
                    </div>
                )} 
            */}
        </React.Fragment>
    );
};

export default Divider;
