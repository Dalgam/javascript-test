import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GradeStarsComponent } from '../grade-stars/grade-stars.component';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [GradeStarsComponent],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.css',
})
export class VideoCardComponent {
  @Input({ required: true }) video: Video = { id: 0, title: '', grade: 0 };
  @Input({ required: true }) disableUpdate: boolean = false;
  @Output() handleChange = new EventEmitter<VideoChange>();

  handleGradeChange(change: GradeChange) {
    this.handleChange.emit({ id: this.video.id, grade: change.value });
  }
}
