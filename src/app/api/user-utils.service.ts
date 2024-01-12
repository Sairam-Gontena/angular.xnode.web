import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserUtilsService extends BaseApiService {
  override get apiUrl(): string {
    return environment.userUtilsApi;
  }
  constructor() {
    super();
  }

  userFeedback(body: any) {
    return this.post('user-feedback', body);
  }
  userBugReport(body: any) {
    return this.post('user-bug-report', body);
  }
  userConversation(body: any) {
    return this.post('user-conversation', body);
  }
  getUserConversation(id: any) {
    return this.get('user-conversation/' + id);
  }
  getUserBugReport() {
    return this.get('user-bug-report');
  }
  getUserFeedback() {
    return this.get('user-feedback');
  }
}
