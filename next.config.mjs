import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
