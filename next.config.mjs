/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },

    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },

    webpack: (config, { isServer }) => {
        config.resolve.fallback = { fs: false, path: false };
        
        // Add explicit alias for @ imports
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': __dirname,
        };
        
        return config;
    },
};

export default nextConfig;
