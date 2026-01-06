import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ItemFormComponent, ItemFormValue } from './item-form.component';
import { ItemsStore } from './items.store';

@Component({
  selector: 'app-item-edit-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ItemFormComponent],
  template: `
    <section class="card">
      <header class="card__header">
        <div class="row">
          <div>
            <h1 class="h1">Edit item</h1>
            <p class="muted" *ngIf="itemName() as name">Editing <span class="mono">{{ name }}</span></p>
          </div>
          <a class="btn btn--ghost" routerLink="/items">Back</a>
        </div>
      </header>

      <div class="card__body">
        <div *ngIf="notFound()" class="error">
          Item not found. <a routerLink="/items" class="link">Return to list</a>.
        </div>

        <app-item-form
          *ngIf="!notFound()"
          submitLabel="Save changes"
          [busy]="busy()"
          [errorText]="errorText()"
          [initialValue]="initialValue()"
          (save)="onSave($event)"
        ></app-item-form>
      </div>
    </section>
  `,
})
export class ItemEditPage {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(ItemsStore);

  protected readonly busy = signal(false);
  protected readonly errorText = signal<string | null>(null);

  private readonly id = computed(() => this.route.snapshot.paramMap.get('id') ?? '');

  protected readonly initialValue = computed(() => {
    const item = this.store.getItemById(this.id());
    if (!item) return null;
    return { name: item.name, description: item.description ?? '' };
  });

  protected readonly notFound = computed(() => !this.store.getItemById(this.id()));
  protected readonly itemName = computed(() => this.store.getItemById(this.id())?.name ?? null);

  onSave(value: ItemFormValue): void {
    this.busy.set(true);
    this.errorText.set(null);

    try {
      const updated = this.store.updateItem(this.id(), value);
      if (!updated) {
        this.errorText.set('Item not found');
      }
    } catch (e) {
      this.errorText.set(e instanceof Error ? e.message : 'Failed to update item');
    } finally {
      this.busy.set(false);
    }
  }
}
