import { Injectable } from '@angular/core';
import { isAndroid } from 'tns-core-modules/platform';

@Injectable()
export class ImageService {

    getIconSource(icon: string): string {
        const iconPrefix = isAndroid ? "res://" : "res://tabIcons/";
        return iconPrefix + icon;
    }
    
}