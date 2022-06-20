# YouTube Retention Tool

### _Compare audience retention for your youtube channel videos_

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnabilfarhann%2Fyt-retention-tools)

### Tech Stacks

- NextJS
- Typescript
- Google API
- Tailwind CSS

## Installation

YT Retention Tool requires [Node.js](https://nodejs.org/) v14+ to run.
Install the dependencies and devDependencies and start the server.

```sh
cd yt-retention-tools
yarn install
yarn dev
```

Environment Variables

```sh
NEXT_PUBLIC_GOOGLE_OAUTH2_CLIENT_ID= <your-google-client-id-key>
NEXT_PUBLIC_GOOGLE_OAUTH2_SECRET= <your-google-secret-key>
NEXT_PUBLIC_GOOGLE_API_KEY= <your-google-api-key>
MAINTENANCE_MODE= 0
```

## API Reference

YT Retention Tool is currently using the following APIs.
Instructions on how to use them in your own application are linked below.

| API | Docs |
| ------ | ------ |
| Youtube Analytics API | [Get Video Retention Data](https://developers.google.com/youtube/analytics/reference/reports/query) |
| Youtube Data API v3 | [Get User Channel Info](https://developers.google.com/youtube/v3/docs/channels/list) |
| Youtube Data API v3 | [Get Video Info](https://developers.google.com/youtube/v3/docs/videos/list) |
| Youtube Data API v3 | [Get Channel Videos](https://developers.google.com/youtube/v3/docs/search/list) |
