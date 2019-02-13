import { Routes } from '@angular/router';

import { EventsComponent } from './events/events.component';
import { EventRatesComponent } from './event-rates/event-rates.component';

export const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full'},
  { path: 'events', component: EventsComponent },
  { path: 'rates/:id', component: EventRatesComponent },
];