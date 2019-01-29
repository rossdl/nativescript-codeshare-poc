import { isAndroid } from 'tns-core-modules/platform';

export class ImageService {

    getIconSource(icon: string): string {
        const iconPrefix = isAndroid ? "res://" : "res://tabIcons/";
        return iconPrefix + icon;
    }
    
}