import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { PeripheralSettings } from "./app.settings.models";
import { Subject } from "rxjs";

const enum StorageKey {
    Peripherals = "PERIPHERALS"
}

@Injectable()
export class ApplicationSettings { 
    
    constructor(private storageService: StorageService) { }

    peripheralsChanged$ = new Subject<PeripheralSettings>();

    set printerName(value: string) {
        const peripheral = { ...this.getPeripherals(), printerName: value };
        this.setPeripherals(peripheral);
    }

    set magReaderName(value: string) {
        const peripheral = { ...this.getPeripherals(), magReaderName: value };
        this.setPeripherals(peripheral);
    }

    set gateName(value: string) {
        const peripheral = { ...this.getPeripherals(), gateName: value };
        this.setPeripherals(peripheral);
    }

    getPeripherals(): PeripheralSettings {
        return this.load<PeripheralSettings>(StorageKey.Peripherals) || new PeripheralSettings();
    }

    setPeripherals(value: PeripheralSettings): void {
        this.save(StorageKey.Peripherals, value);
        this.peripheralsChanged$.next(value);
    }

    private load<T>(key: string): T {
        return this.storageService.get<T>(key);
    }

    private save<T>(key: string, value: T): void {
        this.storageService.set(key, value);
    }
}