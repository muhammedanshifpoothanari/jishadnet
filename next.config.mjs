// @ts-nocheck
/** @type {import('next').NextConfig} */
export default async function nextConfig(phase, { defaultConfig }) {
  return {
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      unoptimized: true,
    },
    distDir: '.next',
    devIndicators: false,
    logging: {
      fetches: {
        fullUrl: true,
        hmrRefreshes: true,
      },
    },
    experimental: {
      transitionIndicator: true,
      browserDebugInfoInTerminal: {
        depthLimit: 100,
        edgeLimit: 100,
        showSourceLocation: true,
      },
      serverActions: {
        allowedOrigins: ['*.vusercontent.net']
      },
    },
    allowedDevOrigins: [
      '*.vusercontent.net',
      '*.dev-vm.vusercontent.net',
    ],
  }
}
