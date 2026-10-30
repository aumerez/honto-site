/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Old honto.ai addresses (previous site) → new pages, so existing links keep working.
  async redirects() {
    const loc = ':locale(en|es|pt)';
    return [
      { source: `/${loc}`, destination: '/', permanent: true },
      { source: `/${loc}/opportunity-map`, destination: '/book?lang=:locale', permanent: true },
      { source: '/opportunity-map', destination: '/book', permanent: true },
      { source: `/${loc}/onboarding`, destination: '/book?lang=:locale', permanent: true },
      { source: '/onboarding', destination: '/book', permanent: true },
      { source: '/demo', destination: '/book', permanent: true },
      { source: `/${loc}/honto-ops`, destination: '/technical', permanent: true },
      { source: '/honto-ops', destination: '/technical', permanent: true },
      { source: `/${loc}/case-studies/:path*`, destination: '/', permanent: false },
      { source: '/case-studies/:path*', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
