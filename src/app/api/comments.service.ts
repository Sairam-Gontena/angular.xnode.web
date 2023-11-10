import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BaseApiService } from './base-api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService extends BaseApiService {
  override get apiUrl(): string {
    return environment.commentsApiUrl;
  }

  constructor() {
    super();
  }

  getComments(params?: any) {
    let url = 'comment';
    return this.get(url, params)
  }

  updateComments(body: any) {
    return this.patch('specs/update-comments/', body);
  }

  addComments(body: any) {
    return this.post('comment', body);
  }

  deletComment(id: any) {
    return this.delete('comment/' + id);
  }
}

