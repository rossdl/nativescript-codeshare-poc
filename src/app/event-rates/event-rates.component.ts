import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParkingEvent } from '../core/event-service/event.models';
import { EventService } from '../core/event-service/event.service';
import { PaymentService } from '../core/payment-service/payment.service';
import { tap, skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-event-rates',
  templateUrl: './event-rates.component.html'
})
export class EventRatesComponent implements OnInit {
  item: ParkingEvent;
  rates: any[];

  processing: boolean = false;
  charge: string;
  status: string;

  constructor(private route: ActivatedRoute, private eventService: EventService,
    private paymentService: PaymentService) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    
    this.eventService.getEvents().then(events => {
        this.item = events.find(e => e.EventID === id);
    });

    this.eventService.getEventRates$(id).subscribe((data: any[]) => {
      this.rates = data.map(d => ({ lot: d.lot.LotDesc, name: d.rate.RateName, fee: d.rate.Fee }));
    });
  }

  purchase(amount: number): void {
    this.charge = `$${amount.toFixed(2)}`;
    this.status = "SEND REQUEST";
    this.processing = true;

    this.paymentService.sendPurchase(amount).pipe(
      tap(r => this.status = r.DL1.concat('\n', r.DL2)),
      skipWhile(r => r.Complete !== 1)
    ).subscribe(_ => setTimeout(() => { this.processing = false }, 3000))
  }
}
