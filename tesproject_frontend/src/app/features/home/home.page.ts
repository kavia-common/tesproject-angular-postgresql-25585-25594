import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { BackendApiService } from '../../api/backend-api.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card">
      <header class="card__header">
        <h1 class="h1">TesProject</h1>
        <p class="muted">Ocean Professional theme · Angular SPA</p>
      </header>

      <div class="card__body">
        <h2 class="h2">Backend status</h2>

        <div class="status">
          <div class="badge" [class.badge--ok]="status() === 'ok'" [class.badge--err]="status() === 'error'">
            {{ statusLabel() }}
          </div>
          <div class="muted" *ngIf="message() as m">Message: <span class="mono">{{ m }}</span></div>
          <div class="error" *ngIf="errorText() as e">{{ e }}</div>
        </div>

        <button class="btn" type="button" (click)="refresh()" [disabled]="status() === 'loading'">
          {{ status() === 'loading' ? 'Refreshing…' : 'Refresh' }}
        </button>
      </div>
    </section>
  `,
})
export class HomePage {
  private readonly api = inject(BackendApiService);

  protected readonly status = signal<'idle' | 'loading' | 'ok' | 'error'>('idle');
  protected readonly message = signal<string | null>(null);
  protected readonly errorText = signal<string | null>(null);

  protected readonly statusLabel = computed(() => {
    switch (this.status()) {
      case 'loading':
        return 'Loading';
      case 'ok':
        return 'Connected';
      case 'error':
        return 'Error';
      default:
        return 'Idle';
    }
  });

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.status.set('loading');
    this.message.set(null);
    this.errorText.set(null);

    this.api.getRootMessage().subscribe((res) => {
      if (res.ok) {
        this.status.set('ok');
        this.message.set(res.data.message ?? '(no message)');
      } else {
        this.status.set('error');
        this.errorText.set(`${res.error.message}${res.error.status ? ` (HTTP ${res.error.status})` : ''}`);
      }
    });
  }
}
