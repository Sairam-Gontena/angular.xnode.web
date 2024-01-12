import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class PublishAppApiService extends BaseApiService {
  override get apiUrl(): string {
    return environment.publishApiUrl;
  }
  constructor() {
    super();
  }

  publishApp(body: any) {
    return this.post('', body);
  }
}
