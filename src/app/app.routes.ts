import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'item/:id', component: ItemDetailComponent },
];
