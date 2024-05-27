import { Component, OnInit } from '@angular/core';
import { VideoListComponent } from '../video-list/video-list.component';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { ApiService } from '../config/api.service';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [VideoListComponent, SearchBoxComponent],
  templateUrl: './video-page.component.html',
  styleUrl: './video-page.component.css',
})
export class VideoPageComponent implements OnInit {
  videos: Video[] = [];
  disableSearch = false;
  disableVideoUpdate = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getVideos();
  }

  getVideos(query?: string) {
    if (this.disableSearch) return;
    this.disableSearch = true;
    this.apiService.getVideos(query).subscribe((videos) => {
      console.log(videos);
      this.videos = videos;
      this.disableSearch = false;
    });
  }

  updateVideo(id: number, changes: VideoChangeBody) {
    if (this.disableVideoUpdate) return;
    this.disableVideoUpdate = true;
    this.apiService.updateVideo(id, changes).subscribe((video) => {
      const index = this.videos.findIndex((video) => video.id === id);
      this.videos[index] = video;
      this.disableVideoUpdate = false;
    });
  }

  handleVideoChange(change: VideoChange) {
    console.log('change 3');
    this.updateVideo(change.id, { grade: change.grade });
  }
}
