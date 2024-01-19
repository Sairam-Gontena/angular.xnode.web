import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class NotifyApiService extends BaseApiService {
  override get apiUrl(): string {
    return environment.notifyApiUrl;
  }
  constructor() {
    super();
  }

  emailNotify(body?: any) {
    let url = 'email/notify';
    return this.post(url, body);
  }
}
