import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Item {
  id: string;
  name: string;
  description?: string;
  updatedAt: string; // ISO timestamp
}

export interface ItemsState {
  items: Item[];
}

@Injectable({ providedIn: 'root' })
export class ItemsStore {
  private readonly state$ = new BehaviorSubject<ItemsState>({
    items: [
      {
        id: 'seed-1',
        name: 'Welcome Item',
        description: 'This is a sample item. Use Create / Edit to see CRUD flows.',
        updatedAt: new Date().toISOString(),
      },
    ],
  });

  /**
   * PUBLIC_INTERFACE
   * Observable of current items list.
   */
  getItems$(): Observable<Item[]> {
    return new Observable<Item[]>((subscriber) => {
      const sub = this.state$.subscribe((s) => subscriber.next(s.items));
      return () => sub.unsubscribe();
    });
  }

  /**
   * PUBLIC_INTERFACE
   * Get a single item by id (snapshot).
   */
  getItemById(id: string): Item | undefined {
    return this.state$.value.items.find((i) => i.id === id);
  }

  /**
   * PUBLIC_INTERFACE
   * Create a new item (in-memory).
   */
  createItem(input: { name: string; description?: string }): Item {
    const now = new Date().toISOString();

    const cryptoObj = (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto;
    const id =
      cryptoObj?.randomUUID?.() ??
      // Fallback that avoids relying on non-existent globals in some runtimes/lint configs.
      `id-${now}-${Math.random().toString(16).slice(2)}`;

    const created: Item = {
      id,
      name: input.name.trim(),
      description: input.description?.trim() || '',
      updatedAt: now,
    };

    this.state$.next({
      items: [created, ...this.state$.value.items],
    });

    return created;
  }

  /**
   * PUBLIC_INTERFACE
   * Update an existing item (in-memory).
   */
  updateItem(id: string, input: { name: string; description?: string }): Item | undefined {
    const now = new Date().toISOString();
    const items = this.state$.value.items.map((i) =>
      i.id === id
        ? {
            ...i,
            name: input.name.trim(),
            description: input.description?.trim() || '',
            updatedAt: now,
          }
        : i,
    );

    const updated = items.find((i) => i.id === id);
    if (!updated) return undefined;

    this.state$.next({ items });
    return updated;
  }
}
