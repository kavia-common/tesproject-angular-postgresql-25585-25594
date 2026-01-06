import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';
import { HomePage } from './features/home/home.page';
import { ItemCreatePage } from './features/items/item-create.page';
import { ItemEditPage } from './features/items/item-edit.page';
import { ItemsListPage } from './features/items/items-list.page';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', component: HomePage },
      { path: 'items', pathMatch: 'full', component: ItemsListPage },
      { path: 'items/new', component: ItemCreatePage },
      { path: 'items/:id/edit', component: ItemEditPage },
    ],
  },
  { path: '**', redirectTo: '' },
];
