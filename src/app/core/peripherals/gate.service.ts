import { Injectable } from "@angular/core";
import { ApplicationSettings } from "../storage/app.settings";
import { BluetoothService } from "../bluetooth/bluetooth.service";
import { PeripheralServiceBase } from "./peripheral.service.base";

@Injectable()
export class GateService extends PeripheralServiceBase { 

    constructor(appSettings: ApplicationSettings, bluetoothService: BluetoothService) { 
        super("gateName", appSettings, bluetoothService);
    }

    openGate(): boolean {
        return this.sendCommand(3);
    }

    closeGate(): boolean {
        return this.sendCommand(4);
    }

    pulseGate(): boolean {
        return this.sendCommand(1);
    }

    private sendCommand(value: number): boolean {
        return this.send(String.fromCharCode(value).concat('\n'));
    }
}