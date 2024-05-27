import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

import {
  Observable,
  catchError,
  concatMap,
  delay,
  of,
  retry,
  throwError,
} from 'rxjs';

@Injectable()
export class ApiService {
  baseUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}
  // GET http://localhost:3000/videos
  getVideos(title?: string): Observable<Video[]> {
    const url = new URL(this.baseUrl + 'videos');
    if (title) {
      url.search = new URLSearchParams({ title_like: title }).toString();
    }
    return this.http.get<Video[]>(url.toString()).pipe(
      // Artificial delay
      concatMap((item) => of(item).pipe(delay(1000))),
      retry(3),
      catchError(this.handleError)
    );
  }

  // PUT http://localhost:3000/videos/${id}
  // I Chose to do a PATCH instead to prevent corruption of DB data.
  // If PUT is absolutely necessary, I would have to make sure all fields are present in the request body.
  // Also only allow title and grade to change to prevent corruption of the data by allowing the user to change ID somehow.
  updateVideo(
    id: number,
    changes: { title?: string; grade?: number }
  ): Observable<Video> {
    return this.http.patch<Video>(this.baseUrl + `videos/${id}`, changes).pipe(
      // Artificial delay
      concatMap((item) => of(item).pipe(delay(1000))),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  makeIntentionalError() {
    return this.http.get('not/a/real/url').pipe(catchError(this.handleError));
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
