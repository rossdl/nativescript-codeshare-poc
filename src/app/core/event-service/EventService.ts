import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ParkingEvent, EventRate, SiteRate, SiteLot } from "./EventModels";
import { Observable, forkJoin, zip } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class EventService { 
    private readonly rootUrl: string = "http://192.168.125.59/OPUsite/EPServer/Api/SiteConfigEvents/"

    constructor(private http: HttpClient) { }

    getEvents(): Promise<ParkingEvent[]> {
        return this.get("SiteEvents");
    }

    getEventRates(): Promise<any> {
        return Promise.all([this.get("EventRates"), this.get("SiteRates")]);
    }

    getEventLots(): Promise<any> {
        return Promise.all([this.get("EventLots"), this.get("SiteLots")]);
    }

    getEventRates$(eventId: string): any {
        const result = forkJoin(this.get$("EventRates"), this.get$("SiteRates"), this.get$("SiteLots"));
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

    private get<T>(api: string): Promise<T> {
        return this.get$<T>(api).toPromise();
    }

    private get$<T>(api: string): Observable<T> {
        const url = `${this.rootUrl}${api}`;
        return this.http.get<T>(url).pipe(tap(result => console.log('http.get', url, result)))
    }
}