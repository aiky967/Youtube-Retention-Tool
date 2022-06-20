const defaultTheme = require('tailwindcss/defaultTheme');
const lineClamp = require('@tailwindcss/line-clamp');
const scrollBarHide = require('tailwind-scrollbar-hide');
const skeletonScreen = require('@gradin/tailwindcss-skeleton-screen');

module.exports = {
    mode: 'jit',
    content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                youtubeRed: '#FF0000',
                almostBlack: '#282828',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [lineClamp, scrollBarHide, skeletonScreen],
};
