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

    // Production optimizasyonları
    swcMinify: true,

    // Experimental özellikler
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
};

export default nextConfig;
