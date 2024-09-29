export default {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },

  output: "standalone",

  webpack(config, { isServer }) {
    return config;
  },
};
