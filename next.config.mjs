import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Production build sırasında ESLint uyarılarını ignore et
        ignoreDuringBuilds: true,
    },

    typescript: {
        // Production build sırasında TypeScript hatalarını ignore et (sadece uyarılar için)
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
