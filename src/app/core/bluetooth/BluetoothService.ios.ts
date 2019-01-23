import { Injectable } from "@angular/core";
import { BluetoothDevice, BluetoothEventType, BluetoothEvent } from "./BluetoothDevice";
import { BluetoothServiceBase } from "./BluetoothServiceBase";

@Injectable()
export class BluetoothService extends BluetoothServiceBase {
    private readonly className: string = this.constructor.name;
    private sessions: any = Object.create(null);

    private inputStreamDelegate: any;
    private delegateCount: number = 1;

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
        console.log(name, "connected", device.connected);
        if (device.connected) {
            this.startConnection(name);
        }
    }

    disconnect(name: string): void { 
        this.killSession(name);
        this.fireEvent(BluetoothEventType.disconnect, name, null);
    }

    send(name: string, message: string): void { 
        const session = this.getSession(name);
        if (!session) return;

        NSRunLoop.currentRunLoop.runUntilDate(new Date((new Date).getTime() + 500));
        if (!session.outputStream.hasSpaceAvailable) {
            this.log(name, 'no session space available');
            return;
        }
        session.outputStream.writeMaxLength(message, message.length);
    }

    private startConnection(name: string): void {
        this.log(name, 'startConnection')
        const session = this.getSession(name);
        if (!session) return;

        // open output stream
        if (session.outputStream.streamStatus !== NSStreamStatus.Open) {
            this.log(name, 'open output stream');
            session.outputStream.scheduleInRunLoopForMode(NSRunLoop.currentRunLoop, NSDefaultRunLoopMode);
            session.outputStream.open();
        }

        // open input stream
        if (session.inputStream.streamStatus !== NSStreamStatus.Open) {
            let streamDelegate = (NSObject as any).extend({
                streamHandleEvent: (stream: NSStream, code: NSStreamEvent) => {
                    console.log('>>> event occurred', name, code);
                    switch (code) {
                        case NSStreamEvent.OpenCompleted:
                            this.fireEvent(BluetoothEventType.connect, name, null);
                            break;
    
                        case NSStreamEvent.HasBytesAvailable:
                            console.log('>>> stream is NSInputStream', stream instanceof NSInputStream);
                            try {
                                let buffer = interop.alloc(1024);
                                const length = (stream as NSInputStream).readMaxLength(buffer, 1024);
                                console.log('>>> data read', length, buffer);

                                let result: NSString;
                                let data: string;
                                const flag = new Date().getSeconds();
                                if (flag < 12) {
                                    console.log(">>> mutable ascii string");
                                    let mutableData1 = NSMutableData.new();
                                    mutableData1.appendBytesLength(buffer, length); 
                                    result = NSString.alloc().initWithDataEncoding(mutableData1, NSASCIIStringEncoding);
                                } else if (flag < 24) {
                                    console.log(">>> mutable utf8 string");
                                    let mutableData2 = NSMutableData.new();
                                    mutableData2.appendBytesLength(buffer, length);
                                    result = NSString.alloc().initWithDataEncoding(mutableData2, NSUTF8StringEncoding);
                                } else if (flag < 36) {
                                    console.log(">>> utf8 string");
                                    result = NSString.stringWithUTF8String(buffer);
                                } else if (flag < 48) {
                                    console.log(">>> CString");
                                    result = NSString.stringWithCStringEncoding(buffer, NSASCIIStringEncoding);
                                } else {
                                    // this didn't seem to work
                                    // e.g.
                                    // >>> interop
                                    // >>> refstring
                                    // >>> result \M-b\M^T\M^B
                                    // >>> data \M-b\M^T\M^B
                                    console.log(">>> interop");
                                    let iref  = new interop.Reference(interop.types.unichar, buffer);
                                    let refstring = "";
                                    for (var i = 0; i++; i < length) {
                                        refstring += iref[i];
                                    }
                                    console.log(`>>> refstring`, refstring);
                                    result = NSString.stringWithString(iref.value);
                                }

                                console.log(">>> result", result);

                                data = result.toString();
                                console.log(">>> data", data);

                                this.fireEvent(BluetoothEventType.message, name, data); 
                            }
                            catch (e) { console.log(">>> get data failed", e) };
                            break;
                    }
                }
            }, {
                name: `BtStreamDelegate${this.delegateCount}`,
                protocols: [NSStreamDelegate]
            });
    
            this.delegateCount++;
            this.inputStreamDelegate = streamDelegate.new();
            session.inputStream.delegate = this.inputStreamDelegate;

            this.log(name, 'open input stream');
            session.inputStream.scheduleInRunLoopForMode(NSRunLoop.currentRunLoop, NSDefaultRunLoopMode);
            session.inputStream.open();
        }
    }

    private getSession(name: string): EASession {
        if (this.sessions[name]) {
            this.log(name, "existing session found");
            return this.sessions[name];
        }

        const dev = this.get(name) as EAAccessory;
        if (!dev.connected) {
            this.log(name, 'device not connected?');
            this.sessions[name] = null;
            return;
        }

        this.log(name, "creating new session");
        this.sessions[name] = new EASession({ accessory: dev, forProtocol: dev.protocolStrings[0] });
        return this.sessions[name];
    }

    private killSession(name: string) {
        this.log(name, 'killSession')
        if (!this.sessions[name]) {
            return;
        }

        const session = this.sessions[name];

        const outputStream = session.outputStream;
        this.log(name, "output stream status", outputStream.streamStatus);
        if (outputStream.streamStatus !== NSStreamStatus.Closed) {
            this.log(name, "closing output stream");
            outputStream.close();
            outputStream.removeFromRunLoopForMode(NSRunLoop.currentRunLoop, NSDefaultRunLoopMode);
        }

        const inputStream = session.inputStream;
        this.log(name, "input stream status", inputStream.streamStatus);
        if (inputStream.streamStatus !== NSStreamStatus.Closed) {
            this.log(name, "closing input stream");
            inputStream.close();
            inputStream.removeFromRunLoopForMode(NSRunLoop.currentRunLoop, NSDefaultRunLoopMode);
            inputStream.delegate = null;
            this.inputStreamDelegate = null;
        }

        session.finalize();
        this.sessions[name] = null;
    }

    private log(message?: any, ...optionalParams: any[]) {
        console.log("######################");
        console.log(message, optionalParams);
        console.log("######################");
    }

    private logError(method: string, e: any) {
        console.log(`************ ERROR ${this.className}.${method} ************`)
        console.log(e);
    }
}