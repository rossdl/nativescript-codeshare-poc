import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

import { BarcodeScanner } from 'nativescript-barcodescanner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { EventService } from './core/event-service/event.service';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { BrowseComponent } from './browse/browse.component';
import { SearchComponent } from './search/search.component';
import { BluetoothService } from './core/bluetooth/bluetooth.service';
import { ImageService } from './core/image-service/image.service';
import { PaymentService } from './core/payment-service/payment.service';
import { ApplicationSettings } from './core/storage/app.settings';
import { StorageService } from './core/storage/storage.service';
import { PrinterService } from './core/peripherals/printer.service';
import { MagReaderService } from './core/peripherals/magreader.service';
import { GateService } from './core/peripherals/gate.service';


// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from 'nativescript-angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ItemDetailComponent,
    BrowseComponent,
    SearchComponent
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptHttpClientModule
  ],
  providers: [
    ApplicationSettings,
    BarcodeScanner,
    BluetoothService,
    EventService,
    GateService,
    ImageService,
    MagReaderService,
    PaymentService,
    PrinterService,
    StorageService
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
