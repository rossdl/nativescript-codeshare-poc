import { BluetoothDevice, BluetoothEventType, BluetoothEvent } from "./BluetoothDevice";
import * as app from "tns-core-modules/application";
import { BluetoothServiceBase } from "./BluetoothServiceBase";

declare let me: any;

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
        try {
            if (!this.has(name)) {
                this.start(name);
            }

            if (!this.isConnected(name)) {
                console.log(`Connect to ${name}`);
                this.get(name).connectToName(name, true);
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

    private logError(method: string, e: any) {
        console.log(`************ ERROR ${this.className}.${method} ************`)
        console.log(e);
    }
}