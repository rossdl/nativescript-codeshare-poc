import { BluetoothDevice, BluetoothEvent } from "./BluetoothDevice";
import { Subject } from "rxjs";

export declare class BluetoothService {
    onEvent$: Subject<BluetoothEvent>;
    isConnected(name: string): boolean;
    getPairedDevices(): BluetoothDevice[];
    connect(name: string): void;
    disconnect(name: string): void;
    send(name: string, message: string): void;
}