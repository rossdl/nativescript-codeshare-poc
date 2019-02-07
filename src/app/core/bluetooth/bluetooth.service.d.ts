import { BluetoothDevice, BluetoothEvent } from "./bluetooth.models";
import { Subject } from "rxjs";

//TODO probably need a PrinterService, MagStripeService, GateModuleService
// THEN consider using BluetoothService in ^ for Android
// AND using individual SDKs in ^ for iOS (rather than writing javascript converted Objective-C)
//  need to create iOS plugins
//  https://docs.nativescript.org/plugins/plugin-reference

export declare class BluetoothService {
    onEvent$: Subject<BluetoothEvent>;
    isConnected(name: string): boolean;
    getPairedDevices(): BluetoothDevice[];
    connect(name: string): void;
    disconnect(name: string): void;
    send(name: string, message: string): void;
}