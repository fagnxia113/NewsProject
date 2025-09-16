export const isProd = import.meta.env.PROD;

export const serverOriginUrl = isProd
  ? window.__WEWE_RSS_SERVER_ORIGIN_URL__
  : import.meta.env.VITE_SERVER_ORIGIN_URL;

export const appVersion = __APP_VERSION__;

export const enabledAuthCode = isProd
  ? window.__WEWE_RSS_ENABLED_AUTH_CODE__ === 'true'
  : import.meta.env.VITE_ENABLED_AUTH_CODE === 'true';
