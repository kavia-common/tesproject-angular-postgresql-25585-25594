import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_ENV, AppEnv } from '../core/env';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app">
      <header class="app__header">
        <div class="header__inner">
          <a class="brand" routerLink="/">
            <span class="brand__dot"></span>
            <span class="brand__text">TesProject</span>
          </a>

          <nav class="nav">
            <a class="nav__link" routerLink="/" routerLinkActive="nav__link--active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
            <a class="nav__link" routerLink="/items" routerLinkActive="nav__link--active">Items</a>
          </nav>

          <div class="header__meta">
            <span class="pill" *ngIf="env.nodeEnv as n">{{ n }}</span>
          </div>
        </div>
      </header>

      <main class="app__main">
        <router-outlet></router-outlet>
      </main>

      <footer class="app__footer">
        <div class="footer__inner">
          <span class="muted">Ocean Professional · Angular</span>
          <span class="muted mono" *ngIf="env.apiBaseUrl">API: {{ env.apiBaseUrl }}</span>
        </div>
      </footer>
    </div>
  `,
})
export class ShellComponent {
  constructor(@Inject(APP_ENV) public readonly env: AppEnv) {}
}
