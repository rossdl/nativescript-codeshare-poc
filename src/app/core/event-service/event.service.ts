import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ParkingEvent, EventRate, SiteRate, SiteLot } from "./event.models";
import { Observable, forkJoin } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { siteEvents, eventRates, siteRates, siteLots } from "./offline.data";

@Injectable()
export class EventService { 
    private readonly rootUrl: string = "http://192.168.125.59/OPUsite/EPServer/Api/SiteConfigEvents/";

    offline: boolean = true;

    constructor(private http: HttpClient) { }

    getEvents(): Promise<ParkingEvent[]> {
        return this.siteEvents().toPromise();
    }

    // not used yet
    // getEventRates(): Promise<any> {
    //     return Promise.all([this.get("EventRates"), this.get("SiteRates")]);
    // }

    // getEventLots(): Promise<any> {
    //     return Promise.all([this.get("EventLots"), this.get("SiteLots")]);
    // }

    getEventRates$(eventId: string): any {
        const result = forkJoin(this.eventRates(), this.siteRates(), this.siteLots());
        return result.pipe(map((data: any[]) => {
            let eventRates = (data[0] as EventRate[]).filter(er => er.EventID === eventId);
            let siteRates = data[1] as SiteRate[];
            let siteLots = data[2] as SiteLot[];
            return eventRates.map((r: EventRate) => {
                const rate = siteRates.find(sr => sr.RateID === r.RateID);
                const lot = siteLots.find(sl => sl.LotID === r.LotID);
                return { rate, lot };
            });
        }));
    }

    private siteEvents(): Observable<ParkingEvent[]> {
        return this.offline ? siteEvents : this.get$("SiteEvents");
    }

    private siteRates(): Observable<SiteRate[]> {
        return this.offline ? siteRates : this.get$("SiteRates");
    }

    private eventRates(): Observable<EventRate[]> {
        return this.offline ? eventRates : this.get$("EventRates");
    }

    private siteLots(): Observable<SiteLot[]> {
        return this.offline ? siteLots : this.get$("SiteLots");
    }

    private get<T>(api: string): Promise<T> {
        return this.get$<T>(api).toPromise();
    }

    private get$<T>(api: string): Observable<T> {
        const url = `${this.rootUrl}${api}`;
        return this.http.get<T>(url).pipe(tap(result => console.log('http.get', url, result)));
    }
}