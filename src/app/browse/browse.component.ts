import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import { distinctUntilChanged } from 'rxjs/operators';
import { BluetoothService } from '../core/bluetooth/BluetoothService';
import * as bluetooth from 'nativescript-bluetooth';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { BluetoothEvent, BluetoothEventType } from '../core/bluetooth/BluetoothDevice';

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

    devices: any[];
    //someitems$: Observable<string[]>;

    constructor(private bluetoothService: BluetoothService) { }

    ngOnInit() {
        this.isEnabledSubscription = this.listenToBluetoothEnabled()
            .pipe(distinctUntilChanged())
            .subscribe(enabled => this.isBluetoothEnabled = enabled);

        this.bluetoothService.onEvent$.subscribe((bte: BluetoothEvent) => {
            console.log(bte);

            const device = this.devices.find(d => d.name === bte.deviceName);

            switch (bte.action) {
                case BluetoothEventType.message:
                    const message: string = bte.message;
                    if (!message.startsWith(';'))
                        return;
        
                    const cardNo = message.substr(1, 16);
                    this.alert('Credit Card', cardNo);
                    break;

                case BluetoothEventType.connect:
                    device.connected = true;
                    break;

                case BluetoothEventType.disconnect:
                    device.connected = false;
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

    addDevice(name: string, UUID: string) {
        this.devices.push({ name, UUID, connected: false });
    }

    listDevices() {
        try {
            let pairedDevices = this.bluetoothService.getPairedDevices();
            pairedDevices.forEach(dev => {
                console.log(dev.Address);
                let uuid: string;
                if (dev.Name.toLowerCase().includes(this.cmdGate)) {
                    uuid = this.cmdGate;
                } else if (dev.Name.toLowerCase().includes(this.cmdMag)) {
                    uuid = this.cmdMag;
                } else {
                    uuid = this.cmdPrint;
                }
                this.addDevice(dev.Name, uuid);
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    toggle(name: string) {
        const device = this.devices.find(d => d.name === name);
        if (device && device.connected) {
            this.bluetoothService.disconnect(name);
        } else {
            this.bluetoothService.connect(name);
        }
    }

    send(name: string, peripheral: string) {
        try {
            if (!this.bluetoothService.isConnected(name)) {
                return;
            }

            const message = peripheral === this.cmdGate ? this.vendGateMessage()
                : peripheral === this.cmdPrint ? this.printMessage()
                    : undefined;

            if (message) {
                console.log('send message', message);
                this.bluetoothService.send(name, message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    printMessage(): string {
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

    vendGateMessage(): string {
        return String.fromCharCode(1).concat('\n');
    }

    randomBarcode(): string {
        return Array(10).join((Math.random().toString(11) + '00000000000000000').slice(2, 18)).slice(0, 9);
    }

    scan() {
        // for PoC, disconnect and start over
        (this.devices || []).forEach(d => {
            if (d.connected) {
                this.bluetoothService.disconnect(d.name);
            }
        });

        this.devices = [];
        this.listDevices();
    }

    private alert(title: string, message: string) {
        dialogs.alert({
            title: title,
            message: message,
            okButtonText: "Ok"
        });
    }
}
