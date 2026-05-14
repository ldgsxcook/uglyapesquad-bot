import path from "node:path";
import { fileURLToPath } from "node:url";

const dashboardDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(dashboardDir, "..");

const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: projectRoot,
  poweredByHeader: false
};

export default nextConfig;
