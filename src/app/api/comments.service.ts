import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private apiService: ApiService) { }

  getComments(content:any) {
    return this.apiService.getApi('specs/get-comments/' + content.id)
  }

  updateComments(body:any) {
    return this.apiService.patchApi(body, 'specs/update-comments/')
  }
}
