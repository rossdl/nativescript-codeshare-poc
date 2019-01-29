import { BluetoothDevice, BluetoothEventType, BluetoothEvent } from "./BluetoothDevice";
import { BluetoothServiceBase } from "./BluetoothServiceBase";

export class BluetoothService extends BluetoothServiceBase {
    private readonly className: string = this.constructor.name;
    private sessions: any = Object.create(null);

    private inputStreamDelegate: any;

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
            const delegateName = "SD".concat((new Date).toJSON().replace(/\D+/g, "").substr(4));
            let streamDelegate = (NSObject as any).extend({
                streamHandleEvent: (stream: NSStream, code: NSStreamEvent) => {
                    console.log('>>> event occurred', name, code);
                    switch (code) {
                        case NSStreamEvent.OpenCompleted:
                            this.fireEvent(BluetoothEventType.connect, name, null);
                            break;
    
                        case NSStreamEvent.HasBytesAvailable:
                            let buffer = interop.alloc(1024);
                            const length = (stream as NSInputStream).readMaxLength(buffer, 1024);
                            console.log('>>> data read', length, buffer);

                            const mutableData = NSMutableData.new();
                            mutableData.appendBytesLength(buffer, length);

                            const data = NSString.alloc().initWithDataEncoding(mutableData, NSASCIIStringEncoding).toString();
                            console.log(">>> data", data);

                            // emit read by line breaks and/or carriage returns
                            // similar to Android BufferedReader.readLine();
                            const linePattern = /[\r\n]+/;
                            if (data.match(linePattern)) {
                                var lines = data.split(linePattern);
                                lines.forEach(line => this.fireEvent(BluetoothEventType.message, name, line));
                            }
                    }
                }
            }, {
                name: delegateName,
                protocols: [NSStreamDelegate]
            });
    
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