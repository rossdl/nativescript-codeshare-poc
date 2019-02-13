import { ApplicationSettings } from "../storage/app.settings";
import { BluetoothService } from "../bluetooth-service/bluetooth.service";
import { BluetoothEvent } from "../bluetooth-service/bluetooth.models";
import { Observable } from "rxjs";
import { filter, map, distinctUntilChanged } from "rxjs/operators";


export abstract class PeripheralServiceBase {

    // maybe this, bluetoothservice, or some connection manager should maintain connections?
    // instead of manually connecting in the browse page
    // for now, this can act when connected

    private name: string;
    protected onEvent = new Observable<BluetoothEvent>();

    constructor(private propertyName: string, private appSettings: ApplicationSettings, private bluetoothService: BluetoothService) {
        this.name = this.appSettings.getPeripherals()[this.propertyName];
        
        this.onEvent = this.bluetoothService.onEvent$.pipe(filter(e => e.deviceName === this.name));

        this.appSettings.peripheralsChanged$.pipe(
            map(s => s[this.propertyName] || ""),
            distinctUntilChanged()
        ).subscribe(name => this.name = name);
    }

    protected send(data: string): boolean {
        if (!this.name) 
            return false;

        if (!this.bluetoothService.isConnected(this.name)) {
            this.bluetoothService.connect(this.name);
            return false; // not a fan, but due to race condition
        }

        this.bluetoothService.send(this.name, data);
        return true;
    }
}