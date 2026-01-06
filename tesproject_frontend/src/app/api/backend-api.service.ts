import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { APP_ENV, AppEnv } from '../core/env';
import { ApiResult, toApiError } from '../core/http-types';

export interface RootMessageResponse {
  message?: string | null;
}

@Injectable({ providedIn: 'root' })
export class BackendApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
  ) {}

  private baseUrl(): string {
    // Keep it forgiving: ensure no trailing slash.
    return (this.env.apiBaseUrl ?? '').replace(/\/+$/, '');
  }

  /**
   * PUBLIC_INTERFACE
   * Gets the backend root response.
   */
  getRootMessage(): Observable<ApiResult<RootMessageResponse>> {
    const url = `${this.baseUrl()}/`;
    return this.http.get<RootMessageResponse>(url).pipe(
      map((data) => ({ ok: true, data }) as const),
      catchError((err) => of({ ok: false, error: toApiError(err) } as const)),
    );
  }
}
