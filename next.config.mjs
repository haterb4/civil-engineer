/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push('canvas');
        return config;
      },
      transpilePackages: ['pdfjs-dist', 'pdf-lib']
};

export default nextConfig;
