import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  scanValue: string = "";

  //constructor(private barcodeScanner: BarcodeScanner) {
  constructor() {
      // Use the constructor to inject services.
  }

  ngOnInit(): void {
      // Use the "ngOnInit" handler to initialize data for the view.
  }

  scan() {
      // this.barcodeScanner.scan({
      //     formats: "QR_CODE, CODE_39",
      //     beepOnScan: true,
      // }).then(r => {
      //     console.log("scan result:");
      //     console.log(r.format, r.text);
      //     this.scanValue = r.text;
      // });
  }

  card() {
      // const cardIo = new CardIo();

      // cardIo.scan({
      //     android: {
      //         requireExpiry: true,
      //         requireCvv: true,
      //         requirePostalCode: false,
      //         returnCardImage: false,
      //         usePaypalActionbarIcon: false
      //     }
      // }).then((result: CreditCard) => {
      //     console.log("CARD.IO RESULT >>> ", result);
      //     this.scanValue = result.content;
      // }, error => {
      //     console.log("CARD.IO ERROR >>> ", error);
      // });
  }
}