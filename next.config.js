const path = require('path');

const mediapipePoseShim = path.resolve(__dirname, 'src/shims/mediapipe-pose.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // Required so styled-components class names match between the server
    // render and the client hydration. Without it the diet page flashes
    // unstyled on first paint.
    styledComponents: true,
  },
  turbopack: {
    resolveAlias: {
      // See src/shims/mediapipe-pose.js. The real package has no ES exports,
      // which Turbopack rejects, and this app only uses MoveNet.
      // Turbopack resolves these relative to the project root, not absolute.
      '@mediapipe/pose': './src/shims/mediapipe-pose.js',
    },
  },
  webpack: (config) => {
    // Same alias for the webpack build, used by `next build --webpack`.
    config.resolve.alias['@mediapipe/pose'] = mediapipePoseShim;
    return config;
  },
};

module.exports = nextConfig;
