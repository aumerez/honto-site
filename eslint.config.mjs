import nextConfig from "eslint-config-next/core-web-vitals";

const eslintConfig = [{ ignores: [".next/**"] }, ...nextConfig];

export default eslintConfig;
