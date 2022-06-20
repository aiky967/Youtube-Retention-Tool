import { Switch } from '@headlessui/react';
import React, { useContext, useEffect } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';
import { AppContext } from '../../context/AppContext';
import { Types } from '../../context/AppTypes';
import useVideoHooks from '../../hooks/useVideoHooks';
import { floatToPercent, floatToSecondsBasedOnDuration, secondsToTimestamp } from '../../utils/Helpers';

interface RetentionGraphProps {
    style?: string;
}

const RetentionGraph: React.FC<RetentionGraphProps> = ({ style }) => {
    const { state, dispatch } = useContext(AppContext);
    const { calculateRetentionGraphByAbsoluteTime, calculateRetentionGraphByTimePercentage } = useVideoHooks();

    useEffect(() => {
        if (state.playerControl.isTimePercentage) {
            calculateRetentionGraphByTimePercentage();
        } else {
            calculateRetentionGraphByAbsoluteTime();
        }
    }, [state.playerControl.isTimePercentage]);

    useEffect(() => {
        if (state.playerControl.isTimePercentage) {
            calculateRetentionGraphByTimePercentage();
        } else {
            calculateRetentionGraphByAbsoluteTime();
        }
    }, [state.videos.analyticsList.video1, state.videos.analyticsList.video2]);

    return (
        <React.Fragment>
            <ResponsiveContainer minHeight='317px' className={style}>
                <LineChart
                    data={state.videos.retentionGraph}
                    onClick={(chartState: CategoricalChartState, event: any) => {
                        const active = Number(chartState?.activeLabel);
                        if (active >= 0) {
                            dispatch({
                                type: Types.UPDATE_PLAYER_PROGRESS,
                                payload: {
                                    currentTime: active,
                                    currentTimePercentage: active * 100,
                                    isTimeUpdate: true,
                                },
                            });
                        }
                    }}
                >
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis
                        dataKey='elapsedVideoTimeRatio'
                        interval={'preserveStartEnd'}
                        type='number'
                        tickCount={3}
                        tickMargin={10}
                        tickFormatter={(value: any, index: number) => {
                            if (state.playerControl.isTimePercentage) {
                                return floatToPercent(value);
                            } else {
                                return secondsToTimestamp(
                                    floatToSecondsBasedOnDuration(value, state.playerControl.maxVideoDuration)
                                );
                            }
                        }}
                    />
                    <YAxis
                        orientation='right'
                        tickMargin={10}
                        tickFormatter={(value: any, index: number) => {
                            return floatToPercent(value);
                        }}
                    />
                    <Tooltip
                        labelFormatter={(value: any) => {
                            if (state.playerControl.isTimePercentage) {
                                return floatToPercent(value);
                            } else {
                                return secondsToTimestamp(
                                    floatToSecondsBasedOnDuration(value, state.playerControl.maxVideoDuration)
                                );
                            }
                        }}
                        formatter={(value: any, name: string) => {
                            return floatToPercent(value);
                        }}
                    />
                    <Legend iconType={'circle'} iconSize={8} align='center' verticalAlign='top' height={40} />
                    <ReferenceLine
                        x={state.playerControl.currentTime}
                        stroke='#FF0000'
                        strokeWidth={2}
                        isFront={true}
                    />
                    {state.videos.analyticsList.video1 && (
                        <Line
                            type='monotone'
                            dataKey='audienceWatchRatioVideo1'
                            name='Video 1'
                            stroke='#8884d8'
                            dot={false}
                        />
                    )}
                    {state.videos.analyticsList.video2 && (
                        <Line
                            type='monotone'
                            dataKey='audienceWatchRatioVideo2'
                            name='Video 2'
                            stroke='#82ca9d'
                            dot={false}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
            <div className='flex flex-col mx-auto items-center pt-3'>
                <Switch
                    checked={state.playerControl.isTimePercentage}
                    onChange={() => {
                        dispatch({
                            type: Types.UPDATE_PLAYER_IS_TIME_PERCENTAGE,
                            payload: { isTimePercentage: !state.playerControl.isTimePercentage },
                        });
                    }}
                    className={`${
                        state.playerControl.isTimePercentage ? 'bg-almostBlack' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200`}
                >
                    <span className='sr-only'>Use setting</span>
                    <span
                        aria-hidden='true'
                        className={`${
                            state.playerControl.isTimePercentage ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    />
                </Switch>
                <span className='text-sm font-medium mt-2'>Absolute Time Elapsed / Elapsed Time Percentage</span>
            </div>
        </React.Fragment>
    );
};

export default RetentionGraph;
