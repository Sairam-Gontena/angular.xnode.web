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

  getAllAgent({accountId, endpoint, page, page_size}: {accountId: string, endpoint: string, page: number, page_size: number}) {
    let url = `agent/${endpoint}/${accountId}?page=${page}&page_size=${page_size}`
    return this.get(url)
  }

  getAgentCount({endpoint, query}: {endpoint: string, query?: Record<string, string>}) {
    let queryParams = new URLSearchParams(query).toString();
    let url = `${endpoint}/count?${queryParams ? queryParams : ''}`;
  
    return this.get(url);
  }


  // getAgentDetails({accountId, endpoint, page, page_size}: {accountId: string, endpoint: string, page: number, page_size: number}) {
  //   let url = `agent/${endpoint}/${accountId}?page=${page}&page_size=${page_size}`
  //   return this.get(url)
  // }
}
