/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.CUSTOM_OUTPUT,
  basePath: process.env.CUSTOM_BASE_PATH,
  env: {
    CUSTOM_BASE_PATH: process.env.CUSTOM_BASE_PATH ?? "", // Force exposure of variables in server and client files
  },
};

module.exports = nextConfig;
