import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, Subject } from "rxjs";
import { distinctUntilChanged } from 'rxjs/operators';
import { BluetoothService } from '../core/bluetooth/bluetooth.service';
import * as bluetooth from 'nativescript-bluetooth';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { BluetoothEvent, BluetoothEventType } from '../core/bluetooth/bluetooth.models';
import { ApplicationSettings } from '../core/storage/app.settings';

@Component({
    selector: 'app-browse',
    templateUrl: './browse.component.html',
    styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
    isEnabledSubscription: Subscription;
    isBluetoothEnabled = false;

    private readonly cmdPrint = "print";
    private readonly cmdGate = "gate";
    private readonly cmdMag = "mag";
    private peripherals: any[];

    constructor(private settings: ApplicationSettings, private bluetoothService: BluetoothService) { }

    ngOnInit() {
        const { printerName, magReaderName, gateName } = this.settings.getPeripherals();
        this.peripherals = [
            { id: this.cmdPrint, type: 'Printer', name: printerName, action: 'print', message: this.printMessage(), connected: false },
            { id: this.cmdGate, type: 'Gate', name: gateName, action: 'pulse', message: this.vendGateMessage(), connected: false },
            { id: this.cmdMag, type: 'Mag Reader', name: magReaderName, action: null, connected: false }
        ];

        this.isEnabledSubscription = this.listenToBluetoothEnabled()
            .pipe(distinctUntilChanged())
            .subscribe(enabled => this.isBluetoothEnabled = enabled);

        this.bluetoothService.onEvent$.subscribe((bte: BluetoothEvent) => {
            console.log(bte);

            const peripheral = this.peripherals.find(p => p.name === bte.deviceName);

            switch (bte.action) {
                case BluetoothEventType.message:
                    const message: string = bte.message;
                    if (!message.startsWith(';'))
                        return;
        
                    const cardNo = message.substr(1, 16);
                    this.alert('Credit Card', cardNo);
                    break;

                case BluetoothEventType.connect:
                    console.log('>>>', bte.deviceName, 'connected');
                    peripheral.connected = true;
                    break;

                case BluetoothEventType.disconnect:
                    console.log('>>>', bte.deviceName, 'disconnected');
                    break;
            }
        });
    }

    ngOnDestroy(): void {
        this.isEnabledSubscription.unsubscribe();
        this.bluetoothService.onEvent$.unsubscribe();
    }

    public listenToBluetoothEnabled(): Observable<boolean> {
        return new Observable(observer => {
            bluetooth.isBluetoothEnabled()
                .then(enabled => observer.next(enabled))

            let intervalHandle = setInterval(
                () => {
                    bluetooth.isBluetoothEnabled()
                        .then(enabled => observer.next(enabled))
                }
                , 1000);

            // stop checking every second on unsubscribe
            return () => clearInterval(intervalHandle);
        });
    }

    setDevice(id: string) {
        const cancel = "No Device";
        const devices = this.bluetoothService.getPairedDevices();
        const peripheral = this.peripherals.find(p => p.id === id);
        const { name, connected } = peripheral;
        dialogs.action({
            message: `Select ${peripheral.type}`,
            cancelButtonText: cancel,
            actions: devices.map(d => d.Name)
        }).then(deviceName => {
            setTimeout(() => {
                // do nothing if same device is connected
                if (connected && name === deviceName) return;

                peripheral.name = deviceName !== cancel ? deviceName : null;
                peripheral.connected = false;

                // disconnect old device
                if (name && this.bluetoothService.isConnected(name)) {
                    this.bluetoothService.disconnect(name);
                }

                // store new selection
                switch (id) {
                    case this.cmdPrint:
                        this.settings.printerName = peripheral.name;
                        break;
                    case this.cmdMag:
                        this.settings.magReaderName = peripheral.name;
                        break;
                    case this.cmdGate:
                        this.settings.gateName = peripheral.name;
                        break;
                }

                // connect if device selected
                if (peripheral.name) {
                    this.bluetoothService.connect(peripheral.name);
                }
            }, 100);
        });
    }

    send(id: string) {
        const peripheral = this.peripherals.find(p => p.id === id);
        if (!peripheral) return;

        const { name, message} = peripheral;
        if(name && message && this.bluetoothService.isConnected(name)) {
            console.log('send message', name, message);
            this.bluetoothService.send(name, message);
        }
    }

    private printMessage(): string {
        //let message = "ABC";
        let barcode = this.randomBarcode();
        let message = "! 0 200 200 300 1\r\n";
        message += "B QR 80 0 M 2 U 6\r\n";
        message += `H4A,E${barcode}\r\n`;
        message += "ENDQR\r\n";
        message += `T 5 0 90 180 ${barcode}\r\n`;
        message += "PRINT\r\n";
        return message;
    }

    private vendGateMessage(): string {
        return String.fromCharCode(1).concat('\n');
    }

    private randomBarcode(): string {
        return Array(10).join((Math.random().toString(11) + '00000000000000000').slice(2, 18)).slice(0, 9);
    }

    private alert(title: string, message: string) {
        dialogs.alert({
            title: title,
            message: message,
            okButtonText: "Ok"
        });
    }
}
