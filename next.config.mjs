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

    webpack: (config) => {
        // Harden path aliasing for Vercel/Linux builds (case-sensitive FS)
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.join(__dirname),
            '@/components': path.join(__dirname, 'components'),
            '@/lib': path.join(__dirname, 'lib'),
            '@/app': path.join(__dirname, 'app'),
        };
        // Ensure TS/TSX are resolvable explicitly
        if (Array.isArray(config.resolve.extensions)) {
            for (const ext of ['.ts', '.tsx']) {
                if (!config.resolve.extensions.includes(ext)) {
                    config.resolve.extensions.push(ext);
                }
            }
        }
        return config;
    },
};

export default nextConfig;
