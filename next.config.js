const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      'date-fns',
    ],
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 70000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    };
    return config;
  },
  sentry: {
    hideSourceMaps: true,
    widenClientFileUpload: true,
  },
};

module.exports = withSentryConfig(
  withBundleAnalyzer(nextConfig),
  {
    silent: true,
    org: "your-org-name",
    project: "your-project-name",
  },
  {
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
  }
);