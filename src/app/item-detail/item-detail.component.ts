import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParkingEvent, SiteRate, EventRate, EventLot } from '../core/event-service/EventModels';
import { EventService } from '../core/event-service/EventService';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  item: ParkingEvent;
  rates: any[];

  constructor(private route: ActivatedRoute, private eventService: EventService) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    
    this.eventService.getEvents().then(events => {
        this.item = events.find(e => e.EventID === id);
    });

    this.eventService.getEventRates$(id).subscribe((data: any[]) => {
      this.rates = data.map(d => ({ lot: d.lot.LotDesc, name: d.rate.RateName, fee: d.rate.Fee }));
    });
  }

}
