import { Injectable } from "@angular/core";
import { ApplicationSettings } from "../storage/app.settings";
import { BluetoothService } from "../bluetooth-service/bluetooth.service";
import { BluetoothEventType } from "../bluetooth-service/bluetooth.models";
import { PeripheralServiceBase } from "./peripheral.service.base";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

@Injectable()
export class MagReaderService extends PeripheralServiceBase { 

    private onMessage: Observable<string>;

    onCreditCard: Observable<string>;

    constructor(appSettings: ApplicationSettings, bluetoothService: BluetoothService) { 
        super("magReaderName", appSettings, bluetoothService);
        
        this.onMessage = this.onEvent.pipe(
            filter(e => e.action === BluetoothEventType.message),
            map(e => e.message)
        );

        this.onCreditCard = this.onMessage.pipe(
            filter(m => m.startsWith(";")),
            map(m => m.substring(1, m.indexOf("=")))
        );
    }
}