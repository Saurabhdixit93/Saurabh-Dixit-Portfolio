import { defineConfig } from 'next';
export default defineConfig({
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: false,
    },
    // Custom Webpack configuration
    webpack(config, { isServer }) {
        return config;
    },
});
