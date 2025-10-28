import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },

    typescript: {
        ignoreBuildErrors: false,
    },

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
        // Explicit path alias resolution
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': __dirname,
            '@/components': path.join(__dirname, 'components'),
            '@/lib': path.join(__dirname, 'lib'),
            '@/app': path.join(__dirname, 'app'),
        };
        return config;
    },
};

export default nextConfig;
