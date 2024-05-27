import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VideoCardComponent } from '../video-card/video-card.component';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [VideoCardComponent],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css',
})
export class VideoListComponent {
  @Input({ required: true }) videos: Video[] = [];
  @Input({ required: true }) disableUpdate: boolean = false;
  @Output() handleChange = new EventEmitter<VideoChange>();

  handleVideoChange(change: VideoChange) {
    console.log('change2');
    this.handleChange.emit(change);
  }
}
