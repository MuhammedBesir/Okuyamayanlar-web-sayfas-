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

    webpack: (config) => {
        config.resolve.fallback = { fs: false, path: false };
        return config;
    },
};

export default nextConfig;
