import { Injectable } from '@angular/core';

@Injectable()
export class ImageService {

    getIconSource(icon: string): string {
        //TODO update this if/when necessary
        return '/' + icon;
    }
    
}