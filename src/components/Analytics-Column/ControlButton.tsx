import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { useContext } from 'react';
import { MdForward5, MdOutlinePause, MdPlayArrow, MdReplay5, MdVolumeDown, MdVolumeUp } from 'react-icons/md';
import { AppContext } from '../../context/AppContext';
import { Types } from '../../context/AppTypes';
import { percentageToFloatBasedOnDuration, secondsToTimestamp } from '../../utils/Helpers';

interface ControlButtonProps {}

const TinyText = styled(Typography)({
    fontSize: '0.75rem',
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
});

const ControlButton: React.FC<ControlButtonProps> = ({}) => {
    const { state, dispatch } = useContext(AppContext);
    const currentSliderPercentage = state.playerControl.currentTime * 100;
    const currentDuration = state.playerControl.currentTime * state.playerControl.maxVideoDuration; // 0.1 --> 64.1

    return (
        <div className='w-full'>
            <div>
                <Stack spacing={2} direction='row' sx={{ mb: 1, px: 0.5, mt: -2 }} alignItems='center'>
                    <Slider
                        aria-label='Video Progress'
                        value={currentSliderPercentage}
                        onChange={(_, percentage) => {
                            dispatch({
                                type: Types.UPDATE_PLAYER_PROGRESS,
                                payload: {
                                    currentTime: percentageToFloatBasedOnDuration(
                                        Number(percentage),
                                        state.playerControl.maxVideoDuration
                                    ),
                                    currentTimePercentage: Number(percentage),
                                    isTimeUpdate: true,
                                },
                            });
                        }}
                        sx={{
                            // color: 'rgba(0,0,0,0.87)',
                            color: '#FF0000',
                            height: 4,
                            '& .MuiSlider-thumb': {
                                width: 8,
                                height: 8,
                                // transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                '&:before': {
                                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                                },
                                '&:hover, &.Mui-focusVisible': {
                                    boxShadow: `0px 0px 0px 8px rgb(0 0 0 / 16%)`,
                                },
                                '&.Mui-active': {
                                    width: 20,
                                    height: 20,
                                },
                            },
                            '& .MuiSlider-rail': {
                                opacity: 0.18,
                            },
                        }}
                    />
                </Stack>
            </div>
            <div className='flex items-center justify-between -mt-4'>
                <TinyText>
                    {state.playerControl.isTimePercentage
                        ? `${Math.round(state.playerControl.currentTimePercentage)}%`
                        : secondsToTimestamp(currentDuration)}
                </TinyText>
                <TinyText>
                    -
                    {state.playerControl.isTimePercentage
                        ? `${Math.round(100 - state.playerControl.currentTimePercentage)}%`
                        : secondsToTimestamp(state.playerControl.maxVideoDuration - currentDuration)}
                </TinyText>
            </div>
            <div className='grid grid-cols-1 xl:grid-cols-3 gap-y-2'>
                <div className='hidden md:block'></div>
                <div className='flex justify-center items-center'>
                    <IconButton
                        aria-label='replay 5s'
                        onClick={() => {
                            const newTime =
                                (state.playerControl.currentTime * state.playerControl.maxVideoDuration - 5) /
                                state.playerControl.maxVideoDuration;
                            const newTimePercentage =
                                ((state.playerControl.currentTime * state.playerControl.maxVideoDuration - 5) /
                                    state.playerControl.maxVideoDuration) *
                                100;
                            dispatch({
                                type: Types.UPDATE_PLAYER_PROGRESS,
                                payload: {
                                    currentTime: newTime < 0 ? 0 : newTime,
                                    currentTimePercentage: newTimePercentage < 0 ? 0 : newTimePercentage,
                                    isTimeUpdate: true,
                                },
                            });
                        }}
                    >
                        <MdReplay5 className='text-lg text-almostBlack' />
                    </IconButton>
                    <IconButton
                        aria-label={state.playerControl.isPlaying ? 'play' : 'pause'}
                        onClick={() => {
                            if (state.playerControl.currentTime == 1) {
                                dispatch({
                                    type: Types.UPDATE_PLAYER_PROGRESS,
                                    payload: {
                                        currentTime: 0,
                                        currentTimePercentage: 0,
                                        isTimeUpdate: true,
                                    },
                                });
                            }
                            dispatch({
                                type: Types.UPDATE_PLAYER_STATE,
                                payload: { isPlaying: !state.playerControl.isPlaying },
                            });
                            dispatch({
                                type: Types.SET_PLAYER_IS_TIME_UPDATE,
                            });
                        }}
                    >
                        {!state.playerControl.isPlaying ? (
                            <MdPlayArrow className='text-4xl text-almostBlack' />
                        ) : (
                            <MdOutlinePause className='text-4xl text-almostBlack' />
                        )}
                    </IconButton>
                    <IconButton
                        aria-label='skip 5s'
                        onClick={() => {
                            const newTime =
                                (state.playerControl.currentTime * state.playerControl.maxVideoDuration + 5) /
                                state.playerControl.maxVideoDuration;
                            const newTimePercentage =
                                ((state.playerControl.currentTime * state.playerControl.maxVideoDuration + 5) /
                                    state.playerControl.maxVideoDuration) *
                                100;
                            dispatch({
                                type: Types.UPDATE_PLAYER_PROGRESS,
                                payload: {
                                    currentTime: newTime == 1 ? 1 : newTime,
                                    currentTimePercentage: newTimePercentage > 100 ? 100 : newTimePercentage,
                                    isTimeUpdate: true,
                                },
                            });
                        }}
                    >
                        <MdForward5 className='text-lg text-almostBlack' />
                    </IconButton>
                </div>
                <div className='w-full xl:w-64 justify-self-center xl:justify-self-end'>
                    {state.videos.analyticsList.video1 && (
                        <div className='grid grid-cols-4 items-center'>
                            <div className='text-[11px] text-almostBlack font-medium text-center mr-2'>Video 1</div>
                            <div className='col-span-3'>
                                <Stack spacing={2} direction='row' sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MdVolumeDown />
                                    <Slider
                                        aria-label='Volume'
                                        value={state.playerControl.video1Volume * 100}
                                        onChange={(_, percentage) => {
                                            dispatch({
                                                type: Types.UPDATE_PLAYER_VIDEO1_VOLUME,
                                                payload: { volume: Number((percentage as number) / 100) },
                                            });
                                        }}
                                        sx={{
                                            color: 'rgba(0,0,0,0.87)',
                                            height: 4,
                                            '& .MuiSlider-thumb': {
                                                width: 8,
                                                height: 8,
                                                '&:hover, &.Mui-focusVisible': {
                                                    boxShadow: `0px 0px 0px 8px rgb(0 0 0 / 16%)`,
                                                },
                                                '&.Mui-active': {
                                                    width: 20,
                                                    height: 20,
                                                },
                                            },
                                            '& .MuiSlider-rail': {
                                                opacity: 0.28,
                                            },
                                        }}
                                    />
                                    <MdVolumeUp />
                                </Stack>
                            </div>
                        </div>
                    )}
                    {state.videos.analyticsList.video2 && (
                        <div className='grid grid-cols-4 items-center'>
                            <div className='text-[11px] text-almostBlack font-medium text-center mr-2'>Video 2</div>
                            <div className='col-span-3'>
                                <Stack spacing={2} direction='row' sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MdVolumeDown />
                                    <Slider
                                        aria-label='Volume'
                                        value={state.playerControl.video2Volume * 100}
                                        onChange={(_, percentage) => {
                                            dispatch({
                                                type: Types.UPDATE_PLAYER_VIDEO2_VOLUME,
                                                payload: { volume: Number((percentage as number) / 100) },
                                            });
                                        }}
                                        sx={{
                                            color: 'rgba(0,0,0,0.87)',
                                            height: 4,
                                            '& .MuiSlider-thumb': {
                                                width: 8,
                                                height: 8,
                                                '&:hover, &.Mui-focusVisible': {
                                                    boxShadow: `0px 0px 0px 8px rgb(0 0 0 / 16%)`,
                                                },
                                                '&.Mui-active': {
                                                    width: 20,
                                                    height: 20,
                                                },
                                            },
                                            '& .MuiSlider-rail': {
                                                opacity: 0.28,
                                            },
                                        }}
                                    />
                                    <MdVolumeUp />
                                </Stack>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ControlButton;
