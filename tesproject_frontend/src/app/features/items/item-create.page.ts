import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ItemFormComponent, ItemFormValue } from './item-form.component';
import { ItemsStore } from './items.store';

@Component({
  selector: 'app-item-create-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ItemFormComponent],
  template: `
    <section class="card">
      <header class="card__header">
        <div class="row">
          <div>
            <h1 class="h1">Create item</h1>
            <p class="muted">Adds a new item (in-memory store for now).</p>
          </div>
          <a class="btn btn--ghost" routerLink="/items">Back</a>
        </div>
      </header>

      <div class="card__body">
        <app-item-form
          submitLabel="Create"
          [busy]="busy()"
          [errorText]="errorText()"
          (save)="onSave($event)"
        ></app-item-form>
      </div>
    </section>
  `,
})
export class ItemCreatePage {
  private readonly store = inject(ItemsStore);
  private readonly router = inject(Router);

  protected readonly busy = signal(false);
  protected readonly errorText = signal<string | null>(null);

  onSave(value: ItemFormValue): void {
    this.busy.set(true);
    this.errorText.set(null);

    try {
      const created = this.store.createItem(value);
      this.router.navigate(['/items', created.id, 'edit']);
    } catch (e) {
      this.errorText.set(e instanceof Error ? e.message : 'Failed to create item');
    } finally {
      this.busy.set(false);
    }
  }
}
