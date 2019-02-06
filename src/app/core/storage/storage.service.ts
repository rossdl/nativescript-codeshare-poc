require( "nativescript-localstorage" );

export class StorageService {

    get<T>(key: string): T {
        return JSON.parse(localStorage.getItem(key)) as T;
    }
    
    set<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    clear(): void {
        localStorage.clear();
    }
}