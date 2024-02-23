import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';
@Injectable({
  providedIn: 'root'
})
export class AgentHubService extends BaseApiService{

  override get apiUrl(): string {
    return environment.apiUrl;
  }
  constructor() {
    super();
  }

  getAllAgent({accountId, endpoint}: {accountId: string, endpoint: string}) {
    let url = `agent/${endpoint}/${accountId}`
    return this.get(url)
  }
}
