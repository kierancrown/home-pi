/* eslint-disable */
const withOffline = require('next-offline');
// your next.js configs
const nextConfig = {
    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };
        return config;
    },
    reactStrictMode: true,
};

module.exports = withOffline(nextConfig);
