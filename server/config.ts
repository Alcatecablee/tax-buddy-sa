/**
 * Application Configuration
 * 
 * Centralized configuration management with environment variable support.
 * All values can be overridden via environment variables for production deployment.
 */

/**
 * SARB API Configuration
 */
export const sarbConfig = {
  /** Base URL for SARB Web API */
  baseUrl: process.env.SARB_API_URL || 'https://custom.resbank.co.za/SarbWebApi',
  
  /** Request timeout in milliseconds */
  timeout: parseInt(process.env.SARB_TIMEOUT || '10000'),
  
  /** Maximum number of retry attempts for failed requests */
  maxRetries: parseInt(process.env.SARB_MAX_RETRIES || '3'),
  
  /** Base backoff delay in milliseconds for exponential backoff */
  baseBackoffMs: parseInt(process.env.SARB_BASE_BACKOFF_MS || '1000'),
};

/**
 * Cache Configuration
 */
export const cacheConfig = {
  /** Default TTL for economic indicators in seconds (1 hour) */
  indicatorsTtl: parseInt(process.env.CACHE_INDICATORS_TTL || '3600'),
  
  /** TTL for tax planning tips in seconds (6 hours) */
  tipsTtl: parseInt(process.env.CACHE_TIPS_TTL || '21600'),
  
  /** TTL for historical data in seconds (2 hours) */
  historicalTtl: parseInt(process.env.CACHE_HISTORICAL_TTL || '7200'),
  
  /** TTL for time series data in seconds (1 hour) */
  seriesTtl: parseInt(process.env.CACHE_SERIES_TTL || '3600'),
  
  /** TTL for municipal/property tax data in seconds (1 hour) */
  municipalDataTtl: parseInt(process.env.CACHE_MUNICIPAL_DATA_TTL || '3600'),
  
  /** Cleanup interval in milliseconds (5 minutes) */
  cleanupInterval: parseInt(process.env.CACHE_CLEANUP_INTERVAL || '300000'),
};

/**
 * Server Configuration
 */
export const serverConfig = {
  /** Server port */
  port: parseInt(process.env.PORT || '5000'),
  
  /** Server host */
  host: process.env.HOST || '0.0.0.0',
  
  /** Environment (development, production) */
  env: process.env.NODE_ENV || 'development',
  
  /** Enable API logging */
  enableApiLogging: process.env.ENABLE_API_LOGGING !== 'false',
};

/**
 * Municipal Finance API Configuration
 */
export const municipalConfig = {
  /** Base URL for Municipal Finance API */
  baseUrl: process.env.MUNICIPAL_API_URL || 'https://municipaldata.treasury.gov.za/api',
  
  /** Request timeout in milliseconds */
  timeout: parseInt(process.env.MUNICIPAL_TIMEOUT || '15000'),
  
  /** Maximum number of retry attempts for failed requests */
  maxRetries: parseInt(process.env.MUNICIPAL_MAX_RETRIES || '3'),
  
  /** Base backoff delay in milliseconds for exponential backoff */
  baseBackoffMs: parseInt(process.env.MUNICIPAL_BASE_BACKOFF_MS || '1000'),
  
  /** Default page size for paginated requests */
  defaultPageSize: parseInt(process.env.MUNICIPAL_PAGE_SIZE || '100'),
};

/**
 * Feature Flags
 */
export const features = {
  /** Enable premium features */
  premiumEnabled: process.env.ENABLE_PREMIUM === 'true',
  
  /** Enable authentication for premium endpoints */
  requireAuth: process.env.REQUIRE_AUTH === 'true',
  
  /** Enable historical data access (premium) */
  enableHistoricalData: process.env.ENABLE_HISTORICAL_DATA !== 'false',
  
  /** Enable municipal/property tax features (Phase 2) */
  enableMunicipalFeatures: process.env.ENABLE_MUNICIPAL_FEATURES !== 'false',
};

/**
 * Export all config as default
 */
export default {
  sarb: sarbConfig,
  municipal: municipalConfig,
  cache: cacheConfig,
  server: serverConfig,
  features,
};
