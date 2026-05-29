/**
 * getSentinelHubToken
 * 
 * Authentication is now handled COMPLETELY by the backend proxy in vite.config.ts.
 * The frontend no longer needs to fetch or send tokens.
 */
export const getSentinelHubToken = async () => {
  return "managed-by-proxy";
};
