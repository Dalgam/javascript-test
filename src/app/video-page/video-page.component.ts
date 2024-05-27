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
    // Prevent further requests to avoid race conditions by disabling input.
    // Alternatives would be, cancel previous request, discard all but last request,
    // queue the latest query, debounce the input, or a combination depending intended UX
    if (this.disableSearch) return;
    this.disableSearch = true;
    this.apiService.getVideos(query).subscribe((videos) => {
      this.videos = videos;
      this.disableSearch = false;
    });
  }

  updateVideo(id: number, changes: VideoChangeBody) {
    //Prevent further requests to avoid race conditions by disabling input.
    // Alternatives would be, cancel previous request, discard all but last request,
    // queue the latest query, debounce the input, or a combination depending intended UX
    if (this.disableVideoUpdate) return;
    this.disableVideoUpdate = true;
    this.apiService.updateVideo(id, changes).subscribe((video) => {
      const index = this.videos.findIndex((video) => video.id === id);
      this.videos[index] = video;
      this.disableVideoUpdate = false;
    });
  }

  // Not sure if I'm drilling down with the change handler too much. Maybe handle state in some sort of service?
  handleVideoChange(change: VideoChange) {
    this.updateVideo(change.id, { grade: change.grade });
  }
}
