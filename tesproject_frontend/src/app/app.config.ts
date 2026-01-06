import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { APP_ENV, loadAppEnv } from './core/env';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router (SPA)
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),

    // HttpClient used by typed API services.
    provideHttpClient(withFetch()),

    // Hydration (SSR template default)
    provideClientHydration(withEventReplay()),

    // Environment config (NG_APP_*)
    { provide: APP_ENV, useFactory: loadAppEnv },
  ],
};
