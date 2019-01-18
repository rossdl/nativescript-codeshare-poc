import { Subject } from "rxjs";
import { BluetoothEvent, BluetoothEventType } from "./BluetoothDevice";

export abstract class BluetoothServiceBase {
    public onEvent$ = new Subject<BluetoothEvent>();

    protected bluetooth: { name: string, device: any}[] = [];

    protected add(name:string, device: any): void {
        if (this.has(name)) return;
        this.bluetooth.push({ name: name, device: device });
    }

    protected has(name: string): boolean {
        return this.bluetooth.some(b => b.name === name);
    }

    protected get(name: string): any {
        const device = this.has(name)
            ? this.bluetooth.find(b => b.name === name).device
            : null;
        console.log('get', name, device);
        return device;
    }

    protected fireEvent(type: BluetoothEventType, name: string, message: string) {
        const btEvent: BluetoothEvent = { action: type,  deviceName: name, message: message};
        this.onEvent$.next(btEvent);
    }

}
