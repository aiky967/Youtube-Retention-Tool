import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

// 641 --> 10:41
export const secondsToTimestamp = (seconds: number) => {
    var h = Math.floor(seconds / 3600)
            .toString()
            .padStart(2, '0'),
        m = Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, '0'),
        s = Math.floor(seconds % 60)
            .toString()
            .padStart(2, '0');

    return Number(h) > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};

// 10:41 --> 641
export const TimestampToSeconds = (time: string) => {
    return time
        .split(':')
        .reverse()
        .reduce((prev, curr: any, i) => prev + curr * Math.pow(60, i), 0);
};

// 0.1 --> 10%
export const floatToPercent = (value: number) => {
    return `${Math.round((value / 1) * 100)}%`;
};

// 0.1 (duration 641) --> 64.10000000000001
export const floatToSecondsBasedOnDuration = (value: number, duration: number) => {
    return (value / 1) * duration;
};

// 10% (duration 641) --> 0.10000000000000002
export const percentageToFloatBasedOnDuration = (value: number, duration: number) => {
    return ((Number(value) / 100) * duration) / duration;
};

export const nFormatter = (num: number, digits: number) => {
    const lookup = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'K' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'B' },
        { value: 1e12, symbol: 'T' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
            return num >= item.value;
        });
    return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
};

export const dFormatter = (date: string) => {
    // return dayjs(date).format('DD MMM YYYY');
    return dayjs(date).fromNow();
};

export const isEmpty = (value: any): boolean => {
    return (
        value === null || // check for null
        value === undefined || // check for undefined
        value === '' || // check for empty string
        (Array.isArray(value) && value.length === 0) || // check for empty array
        (typeof value === 'object' && Object.keys(value).length === 0) // check for empty object
    );
};

export const round = (value: number, decimals: number) => {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};
