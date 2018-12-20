import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  getIconSource(icon: string): string {
    //const iconPrefix = isAndroid ? "res://" : "res://tabIcons/";
    const iconPrefix = "res://";
    return iconPrefix + icon;
  }
}
