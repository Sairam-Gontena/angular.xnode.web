import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class WorkflowApiService extends BaseApiService {
  override get apiUrl(): string {
    return environment.workFlowApiUrl;
  }
  constructor() {
    super();
  }

  workflow(body: any) {
    return this.post('api/json-bpmn', body);
  }
}
