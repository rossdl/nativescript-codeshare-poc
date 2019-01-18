import { Injectable } from "@angular/core";
import { BluetoothDevice, BluetoothEventType, BluetoothEvent } from "./BluetoothDevice";
import * as app from "tns-core-modules/application";
import { Subject } from "rxjs";
import { BluetoothServiceBase } from "./BluetoothServiceBase";

@Injectable()
export class BluetoothService extends BluetoothServiceBase {
    private readonly className: string = this.constructor.name;

    constructor() { 
        super();
        console.log('hey', this.className);
    }

    isConnected(name: string): boolean { 
        const bt = this.get(name) as EAAccessory;
        return bt && bt.connected;
    };

    // in this instance, paired devices are connected devices
    // seems iOS only returns the paired devices that are connected?
    getPairedDevices(): BluetoothDevice[] { 
        const devices = new Array<BluetoothDevice>();
        const manager = EAAccessoryManager.sharedAccessoryManager();
        const pairedDevices = manager.connectedAccessories;
        for (let i = 0; i < pairedDevices.count; i++) {
            let dev = pairedDevices.objectAtIndex(i);
            console.log('iOS', dev.name, dev.connected);
            this.add(dev.name, dev);
            devices.push(new BluetoothDevice(dev.name, dev.protocolStrings.count ? dev.protocolStrings[0] : ''));
        }
        return devices;
    }

    connect(name: string): void { 
        const device = this.get(name) as EAAccessory;
        console.log('connect', name, device.connected);
        if (device.connected) {
            this.fireEvent(BluetoothEventType.connect, name, null);
        }
    }

    disconnect(name: string): void { 
        this.fireEvent(BluetoothEventType.disconnect, name, null);
    }

    send(name: string, message: string): void { 
        const dev = this.get(name) as EAAccessory;
        if (!dev.connected) {
            console.log(name, 'device not connected?');
            return;
        }
        const session = new EASession({ accessory: dev, forProtocol: dev.protocolStrings[0] });
        session.outputStream.scheduleInRunLoopForMode(NSRunLoop.currentRunLoop, NSDefaultRunLoopMode);
        session.outputStream.open();
        NSRunLoop.currentRunLoop.runUntilDate(new Date((new Date).getTime() + 500));
        if (!session.outputStream.hasSpaceAvailable) {
            console.log(name, 'no session space available');
            return;
        }
        session.outputStream.writeMaxLength(message, message.length);
        session.outputStream.close();
        session.outputStream.removeFromRunLoopForMode(NSRunLoop.currentRunLoop, NSDefaultRunLoopMode);
    }

    private logError(method: string, e: any) {
        console.log(`************ ERROR ${this.className}.${method} ************`)
        console.log(e);
    }
}