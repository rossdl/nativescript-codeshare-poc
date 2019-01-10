export class BluetoothDevice {
    Name: string;
    Address: string;
    constructor(name: string, address: string) {
        this.Name = name;
        this.Address = address;
    }
}

export enum BluetoothEventType {
    connect = "connect",
    disconnect = "disconnect",
    message = "message",
    error = "error",
    connectError = "connectError"
}

export class BluetoothEvent {
    action: BluetoothEventType;
    deviceName: string;
    message: string;
}