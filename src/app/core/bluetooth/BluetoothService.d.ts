import { BluetoothDevice } from "./BluetoothDevice";

export declare class BluetoothService {
    isConnected(name: string): boolean;
    getPairedDevices(): BluetoothDevice[];
    connect(name: string): void;
    disconnect(name: string): void;
    send(name: string, message: string): void;
}