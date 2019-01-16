import { Injectable } from "@angular/core";
import { BluetoothDevice, BluetoothEventType, BluetoothEvent } from "./BluetoothDevice";
import * as app from "tns-core-modules/application";
import { Subject } from "rxjs";

@Injectable()
export class BluetoothService {
    //private bluetooth: any[] = [];

    private readonly className: string = this.constructor.name;

    public onEvent$ = new Subject<BluetoothEvent>();

    constructor() { 
        console.log('hey', this.className);
    }

    isConnected(name: string): boolean { return false; };
    getPairedDevices(): BluetoothDevice[] { return []; }
    connect(name: string): void { }
    disconnect(name: string): void { }
    send(name: string, message: string): void { }
}