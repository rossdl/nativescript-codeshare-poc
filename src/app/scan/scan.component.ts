import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "nativescript-barcodescanner";
import { MagReaderService } from '../core/peripherals/magreader.service';

// card.io causes iOS app to crash; remove for now
// import { CardIo } from "digitaltown-nativescript-card-io";
// import { CreditCard } from 'digitaltown-nativescript-card-io/card-io.common';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  scanValue: string = "";

  constructor(private barcodeScanner: BarcodeScanner, private magReaderService: MagReaderService) { }

  ngOnInit(): void {
      this.magReaderService.onCreditCard.subscribe(m => this.scanValue = m );
  }

  scan() {
    this.barcodeScanner.scan({
        formats: "QR_CODE, CODE_39",
        beepOnScan: true,
    }).then(r => {
        console.log("scan result:");
        console.log(r.format, r.text);
        this.scanValue = r.text;
    });
  }

//   card() {
//       const cardIo = new CardIo();

//       cardIo.scan({
//           android: {
//               requireExpiry: true,
//               requireCvv: true,
//               requirePostalCode: false,
//               returnCardImage: false,
//               usePaypalActionbarIcon: false
//           }
//       }).then((result: CreditCard) => {
//           console.log("CARD.IO RESULT >>> ", result);
//           this.scanValue = result.content;
//       }, error => {
//           console.log("CARD.IO ERROR >>> ", error);
//       });
//   }
}
