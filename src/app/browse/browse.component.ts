import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import { distinctUntilChanged } from 'rxjs/operators';
import { BluetoothService } from '../core/bluetooth/BluetoothService';
import * as bluetooth from 'nativescript-bluetooth';

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

  devices: any[];

  constructor(private bluetoothService: BluetoothService) { }

  ngOnInit() {
      this.isEnabledSubscription = this.listenToBluetoothEnabled()
          .pipe(distinctUntilChanged())
          .subscribe(enabled => this.isBluetoothEnabled = enabled);
  }

  ngOnDestroy(): void {
      this.isEnabledSubscription.unsubscribe();
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
      this.devices.push({ name, UUID });
  }

  listDevices() {
      try {
          let pairedDevices = this.bluetoothService.getPairedDevices();
          pairedDevices.forEach(dev => {
              console.log(dev.Address);
              let uuid: string = dev.Name.toLowerCase().includes(this.cmdGate) ? this.cmdGate : this.cmdPrint; //PoC
              this.addDevice(dev.Name, uuid);
          });
      }
      catch (e) {
          console.log(e);
      }
  }

  send(name: string, peripheral: string) {
      // PoC of course
      try {
          this.bluetoothService.connect(name);
          if (!this.bluetoothService.isConnected(name)) {
              return;
          }

          let message = peripheral === this.cmdGate
              ? this.vendGateMessage()
              : this.printMessage();

          console.log('send message', message);
          this.bluetoothService.send(name, message);
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
      return Array(10).join((Math.random().toString(11)+'00000000000000000').slice(2, 18)).slice(0, 9);
  }

  scan() {
      this.devices = [];
      this.listDevices();
  }
}
