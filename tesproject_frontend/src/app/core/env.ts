import { InjectionToken } from '@angular/core';

export type FeatureFlags = Record<string, boolean | string | number>;

/**
 * Environment configuration for the frontend.
 *
 * This app is deployed in environments where config is provided via NG_APP_*
 * environment variables. For SSR, we can access process.env. For purely
 * browser builds, the values may be injected by the hosting runtime; as a
 * fallback, we also allow (window as any).__env to supply them.
 */
export interface AppEnv {
  apiBaseUrl: string;
  backendUrl?: string;
  frontendUrl?: string;
  wsUrl?: string;
  nodeEnv?: string;
  logLevel?: string;
  healthcheckPath?: string;
  featureFlags?: FeatureFlags;
  experimentsEnabled?: boolean;
}

/**
 * PUBLIC_INTERFACE
 * Injection token used throughout the app to access environment configuration.
 */
export const APP_ENV = new InjectionToken<AppEnv>('APP_ENV');

function readFromWindow(key: string): string | undefined {
  // SSR-safe: globalThis is always defined; window may not exist on the server.
  const w = (globalThis as unknown as { window?: unknown }).window as { __env?: Record<string, string> } | undefined;
  return w?.__env?.[key];
}

function readFromProcessEnv(key: string): string | undefined {
  // SSR-safe: process may exist on server; in browser builds, it may be undefined.
  const p = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process;
  return p?.env?.[key];
}

function readString(key: string): string | undefined {
  return readFromProcessEnv(key) ?? readFromWindow(key);
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  return undefined;
}

function parseJson(value: string | undefined): unknown | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

/**
 * PUBLIC_INTERFACE
 * Loads the application environment configuration.
 *
 * Note: Do NOT hardcode URLs. Ensure NG_APP_API_BASE is set in the container .env.
 */
export function loadAppEnv(): AppEnv {
  const apiBaseUrl = readString('NG_APP_API_BASE') ?? readString('NG_APP_BACKEND_URL') ?? '';
  const featureFlagsRaw = parseJson(readString('NG_APP_FEATURE_FLAGS'));

  return {
    apiBaseUrl,
    backendUrl: readString('NG_APP_BACKEND_URL'),
    frontendUrl: readString('NG_APP_FRONTEND_URL'),
    wsUrl: readString('NG_APP_WS_URL'),
    nodeEnv: readString('NG_APP_NODE_ENV'),
    logLevel: readString('NG_APP_LOG_LEVEL'),
    healthcheckPath: readString('NG_APP_HEALTHCHECK_PATH'),
    featureFlags: (typeof featureFlagsRaw === 'object' && featureFlagsRaw !== null ? (featureFlagsRaw as FeatureFlags) : undefined),
    experimentsEnabled: parseBoolean(readString('NG_APP_EXPERIMENTS_ENABLED')),
  };
}
