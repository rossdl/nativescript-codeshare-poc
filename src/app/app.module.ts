import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { EventService } from './core/event-service/EventService';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ImageService } from './core/image-service/image.service';
import { PaymentService } from './core/payment-service/payment.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ItemDetailComponent
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
