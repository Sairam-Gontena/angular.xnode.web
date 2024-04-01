import { Injectable, Injector } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AgentHubService extends BaseApiService {

  override get apiUrl(): string {
    return environment.apiUrl;
  }
  constructor(private injector: Injector) {
    super();
  }

  get getHttp() {
    return this.injector.get(HttpClient);
  }

  getAllAgent({ accountId, endpoint, page, page_size }: { accountId: string, endpoint: string, page: number, page_size: number }) {
    let url = `agent/${endpoint}/${accountId}?page=${page}&page_size=${page_size}`
    return this.get(url)
  }

  getAgentCount({ endpoint, query }: { endpoint: string, query?: Record<string, string> }) {
    let queryParams = new URLSearchParams(query).toString();
    let url = `${endpoint}/count?${queryParams ? queryParams : ''}`;

    return this.get(url);
  }

  getAgentDetail(urlParam: any): Observable<any> {
    return this.getHttp.get<any>(this.apiUrl + urlParam.url, { params: urlParam.params });
  }

  // getAgentDetails({accountId, endpoint, page, page_size}: {accountId: string, endpoint: string, page: number, page_size: number}) {
  //   let url = `agent/${endpoint}/${accountId}?page=${page}&page_size=${page_size}`
  //   return this.get(url)
  // }
}
