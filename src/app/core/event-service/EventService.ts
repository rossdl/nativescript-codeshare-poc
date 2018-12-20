import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ParkingEvent } from "./EventModels";
import { tap } from 'rxjs/operators';

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

    private get<T>(api: string): Promise<T> {
        return this.http.get<T>(`${this.rootUrl}${api}`)
            .pipe(tap(_ => console.log(`get ${api}`)))
            .toPromise();
    }
}