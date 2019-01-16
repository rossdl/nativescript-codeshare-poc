import { Component } from '@angular/core';
import { ImageService } from './core/image-service/image.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private imageService: ImageService) { }

  getIconSource(icon: string): string {
    return this.imageService.getIconSource(icon);
  }
}