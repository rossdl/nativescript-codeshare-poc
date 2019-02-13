import { Injectable } from "@angular/core";
import { ApplicationSettings } from "../storage/app.settings";
import { BluetoothService } from "../bluetooth-service/bluetooth.service";
import { PeripheralServiceBase } from "./peripheral.service.base";

@Injectable()
export class PrinterService extends PeripheralServiceBase { 

    constructor(appSettings: ApplicationSettings, bluetoothService: BluetoothService) { 
        super("printerName", appSettings, bluetoothService);
    }

    printLine(value: string): boolean {
        return this.send(value.concat("\r\n"));
    }

    printQrCode(barcode: string): boolean {
        let message = "! 0 200 200 300 1\r\n";
        message += "B QR 80 0 M 2 U 6\r\n";
        message += `H4A,E${barcode}\r\n`;
        message += "ENDQR\r\n";
        message += `T 5 0 90 180 ${barcode}\r\n`;
        message += "PRINT\r\n";
        return this.send(message);
    }
}