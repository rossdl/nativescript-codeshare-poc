import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import { EventsComponent } from './events/events.component';
import { EventRatesComponent } from './event-rates/event-rates.component';
import { DevicesComponent } from './devices/devices.component';
import { ScanComponent } from './scan/scan.component';

const routes: Routes = [
  { path: "", redirectTo: "/(eventsTab:events//devicesTab:devices//scanTab:scan)", pathMatch: "full" },
  { path: "events", component: EventsComponent, outlet: "eventsTab" },
  { path: "devices", component: DevicesComponent, outlet: "devicesTab" },
  { path: "scan", component: ScanComponent, outlet: "scanTab" },
  { path: "rates/:id", component: EventRatesComponent, outlet: "eventsTab" }
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
