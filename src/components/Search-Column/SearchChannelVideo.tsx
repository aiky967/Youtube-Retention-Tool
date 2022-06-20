import { Switch } from '@headlessui/react';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { IVideoData } from '../../context/reducers/videosReducer';

interface SearchChannelVideoProps {
    setVideoSearchResult: React.Dispatch<React.SetStateAction<IVideoData[]>>;
}

const SearchChannelVideo: React.FC<SearchChannelVideoProps> = ({ setVideoSearchResult }) => {
    const { state, dispatch } = useContext(AppContext);
    const [searchValue, setSearchValue] = useState<string>('');
    const [listPrivate, setListPrivate] = useState<boolean>(false);

    useEffect(() => {
        setVideoSearchResult(
            state.videos.searchedList.filter((video: IVideoData) => {
                if (listPrivate) {
                    return video.title.toLowerCase().includes(searchValue.toLowerCase());
                } else {
                    return (
                        video.title.toLowerCase().includes(searchValue.toLowerCase()) &&
                        video.privacyStatus === 'public'
                    );
                }
            })
        );
    }, [searchValue, listPrivate]);

    return (
        <div className='w-full'>
            <div>
                <div className='flex items-center justify-between'>
                    <label htmlFor='videoTitle' className='ml-1 mb-1 block text-sm font-medium text-almostBlack'>
                        Video Title
                    </label>
                </div>
                <input
                    id='videoTitle'
                    name='videoTitle'
                    type='text'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm'
                    placeholder='Joma in NYC'
                />
                <Switch.Group as='div' className='flex items-center justify-between mt-3 px-1'>
                    <span className='flex-grow flex flex-col'>
                        <Switch.Label as='span' className='text-sm font-medium text-gray-900' passive>
                            Show private videos
                        </Switch.Label>
                        <Switch.Description as='span' className='text-xs text-gray-500'>
                            Your private videos will be visible in the search results
                        </Switch.Description>
                    </span>
                    <Switch
                        checked={listPrivate}
                        onChange={() => setListPrivate(!listPrivate)}
                        className={`${
                            listPrivate ? 'bg-almostBlack' : 'bg-gray-200'
                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200`}
                    >
                        <span
                            aria-hidden='true'
                            className={`
                                ${listPrivate ? 'translate-x-5' : 'translate-x-0'}
                                pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
                            `}
                        />
                    </Switch>
                </Switch.Group>
            </div>
        </div>
    );
};

export default SearchChannelVideo;
