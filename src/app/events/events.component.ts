import { Component, OnInit } from '@angular/core';
import { EventService } from '../core/event-service/event.service';
import { ParkingEvent } from '../core/event-service/event.models';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  items: Array<ParkingEvent>;
  errorMessage: string;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  onRefresh(args: any): void {
    this.loadEvents();
  }

  toggleMode(args: any): void {
    this.eventService.offline = !this.eventService.offline;
    this.loadEvents();
  }

  private loadEvents(): void {
    this.eventService.getEvents().then(events => {
      this.items = events;
      this.errorMessage = null;
    }).catch(err => {
      this.items = [];
      this.errorMessage = err.message;
    });
  }
}
