import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoPageComponent } from './video-page/video-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VideoPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'javascript-test';
}
