import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { Item, ItemsStore } from './items.store';

type ViewModel = { items: Item[]; isEmpty: boolean };

@Component({
  selector: 'app-items-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe, DatePipe],
  template: `
    <section class="card">
      <header class="card__header row">
        <div>
          <h1 class="h1">Items</h1>
          <p class="muted">Minimal CRUD flows (list/create/update) with states.</p>
        </div>

        <a class="btn btn--primary" routerLink="/items/new">Create item</a>
      </header>

      <div class="card__body">
        <ng-container *ngIf="vm$ | async as vm; else loading">
          <div *ngIf="vm.isEmpty" class="empty">
            <h2 class="h2">No items yet</h2>
            <p class="muted">Create your first item to see the flow.</p>
            <a class="btn btn--primary" routerLink="/items/new">Create item</a>
          </div>

          <ul *ngIf="!vm.isEmpty" class="list">
            <li *ngFor="let item of vm.items" class="list__item">
              <div class="list__main">
                <div class="list__title">{{ item.name }}</div>
                <div class="muted">{{ item.description || '—' }}</div>
                <div class="muted small">Updated {{ item.updatedAt | date: 'medium' }}</div>
              </div>
              <div class="list__actions">
                <a class="btn btn--ghost" [routerLink]="['/items', item.id, 'edit']">Edit</a>
              </div>
            </li>
          </ul>
        </ng-container>

        <ng-template #loading>
          <div class="skeleton">
            <div class="skeleton__line"></div>
            <div class="skeleton__line"></div>
            <div class="skeleton__line"></div>
          </div>
        </ng-template>
      </div>
    </section>
  `,
})
export class ItemsListPage {
  private readonly store = inject(ItemsStore);

  vm$: Observable<ViewModel> = this.store.getItems$().pipe(
    map((items) => ({ items, isEmpty: items.length === 0 })),
    startWith({ items: [], isEmpty: false }),
  );
}
