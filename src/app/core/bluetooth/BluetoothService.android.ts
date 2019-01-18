import { Injectable } from "@angular/core";
import { BluetoothDevice, BluetoothEventType, BluetoothEvent } from "./BluetoothDevice";
import * as app from "tns-core-modules/application";
import { Subject } from "rxjs";
import { BluetoothServiceBase } from "./BluetoothServiceBase";

declare let me: any;

@Injectable()
export class BluetoothService extends BluetoothServiceBase {
    private readonly className: string = this.constructor.name;

    constructor() { 
        super();
        console.log('hey', this.className);
    }

    isConnected(name: string): boolean {
        const bt = this.get(name);
        return bt && bt.isConnected();
    }

    private start(name: string) {
        try {
            console.log('startBluetooth');

            if (me.aflak.bluetooth.Bluetooth) {
                if (!this.has(name)) {
                    const device = new me.aflak.bluetooth.Bluetooth(app.android.context);
                    device.setDeviceCallback(new me.aflak.bluetooth.DeviceCallback({
                        onDeviceConnected: (device: any) => { this.fireEvent(BluetoothEventType.connect, name, null) },
                        onDeviceDisconnected: (device: any, message: string) => { this.fireEvent(BluetoothEventType.disconnect, name, message) },
                        onMessage: (message: string) => { this.fireEvent(BluetoothEventType.message, name, message) },
                        onError: (message: string) => { this.fireEvent(BluetoothEventType.error, name, message) },
                        onConnectError: (device: any, message: string) => { this.fireEvent(BluetoothEventType.connectError, name, message) }
                    }));
                    this.add(name, device);
                }
                console.log('this.bluetooth', this.bluetooth);
                const bt = this.get(name);
                bt.onStart();
                bt.enable();
            }
        }
        catch (e) {
            this.logError("start", e);
        }
    }

    private stop(name: string) {
        try {
            console.log('stopBluetooth');

            if (this.has(name)) {
                const bt = this.get(name);
                bt.onStop();
            }
        }
        catch (e) {
            this.logError("stop", e);
        }
    }

    getPairedDevices(): BluetoothDevice[] {
        const bt = new me.aflak.bluetooth.Bluetooth(app.android.context);
        bt.onStart();
        bt.enable();

        let devices = new Array<BluetoothDevice>();
        let pairedDevices = bt.getPairedDevices() as java.util.List<android.bluetooth.BluetoothDevice>;
        for (let i = 0; i < pairedDevices.size(); i++) {
            let dev = pairedDevices.get(i);
            devices.push(new BluetoothDevice(dev.getName(), dev.getAddress()));
        }

        //bt.onStop();

        return devices;
    }       

    connect(name: string) {
        // PoC of course
        try {
            if (!this.has(name)) {
                console.log(`add name ${name}`);
                this.start(name);
            }

            if (!this.isConnected(name)) {
                console.log(`Connect to ${name}`);
                this.get(name).connectToName(name, true);
            }

            let attempt = 0;
            while (!this.isConnected(name) && attempt < 10) {
                this.sleep(500);
                attempt++;
            }

            if (!this.isConnected(name)) {
                console.log('can\'t connect, try again');
                this.reset(name);
                return;
            }
        }
        catch (e) {
            this.logError("connect", e);
        }
    }

    disconnect(name: string) {
        this.stop(name);
        this.get(name).disconnect();
        //TODO remove from array?
    }

    send(name: string, message: string): void {
        this.get(name).send(message, null);
    }

    // no idea if this is truly necessary yet
    private reset(name: string) {
        console.log('reset');
        this.stop(name);
        this.sleep(500);
        this.start(name);
    }

    private sleep(ms: number): void {
        java.lang.Thread.sleep(ms);
    }

    private logError(method: string, e: any) {
        console.log(`************ ERROR ${this.className}.${method} ************`)
        console.log(e);
    }
}