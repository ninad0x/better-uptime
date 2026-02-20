const nextConfig = {
  transpilePackages: ["@repo/auth", "@repo/db", "@repo/ui"],
  outputFileTracingIncludes: {
    "/api/**": ["./packages/db/generated/prisma/**"]
  }
};

export default nextConfig;