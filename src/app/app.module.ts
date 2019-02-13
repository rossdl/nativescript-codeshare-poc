import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';
import { EventService } from './core/event-service/event.service';
import { EventRatesComponent } from './event-rates/event-rates.component';
import { ImageService } from './core/image-service/image.service';
import { PaymentService } from './core/payment-service/payment.service';

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    EventRatesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    EventService,
    ImageService,
    PaymentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
