import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private apiService: ApiService) { }

  getComments(content?: any) {
    let url = '/comment';
    if (content) {
      url = '/comment' + content.id
    }
    return this.apiService.getComments(url)
  }

  updateComments(body: any) {
    return this.apiService.patchApi(body, 'specs/update-comments/')
  }

  addComments(body: any) {
    return this.apiService.postComments(body, 'comment')
  }
}
