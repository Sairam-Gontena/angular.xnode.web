import { Injectable, Injector } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AgentHubService extends BaseApiService {
  private agentHeaderObj: Subject<any> = new Subject();
  private agentHeaderDetail: any;

  override get apiUrl(): string {
    return environment.apiUrl;
  }
  constructor(private injector: Injector) {
    super();
  }

  get getHttp() {
    return this.injector.get(HttpClient);
  }

  //set agent header
  setAgentHeader(headerObj: any) {
    this.agentHeaderDetail = headerObj;
  }

  //get agent header
  getAgentHeader() {
    return this.agentHeaderDetail;
  }

  //set agent header
  saveAgentHeaderObj(headerObj: any) {
    this.agentHeaderObj.next(headerObj);
  }

  //get agent header
  changeAgentHeaderObj(): Observable<any> {
    return this.agentHeaderObj.asObservable();
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

  //get agent detail by accountID
  getAgentDetailByAccountID(urlParam: any): Observable<any> {
    return this.getHttp.get<any>(this.apiUrl + urlParam.url, { params: urlParam.params });
  }

  //get agent detail by agentID
  getAgentDetail(urlParam: any): Observable<any> {
    return this.getHttp.get<any>(this.apiUrl + urlParam.url, { params: urlParam.params });
  }

  // getAgentDetails({accountId, endpoint, page, page_size}: {accountId: string, endpoint: string, page: number, page_size: number}) {
  //   let url = `agent/${endpoint}/${accountId}?page=${page}&page_size=${page_size}`
  //   return this.get(url)
  // }

  postData(urlParam: any): Observable<any> {
    return this.getHttp.post(this.apiUrl + urlParam.url, urlParam.data);
  }

  updateData(urlParam: any): Observable<any> {
    return this.getHttp.put(this.apiUrl + urlParam.url, JSON.stringify(urlParam.data));
  }

  //get prompts by topic id
  getPromptDataByTopic(urlParam: any): Observable<any> {
    return this.getHttp.get(this.apiUrl + urlParam.url, { params: urlParam.params });
  }

  //get topic details by topic id
  getTopicDetailByID(urlParam: any): Observable<any> {
    return this.getHttp.get(this.apiUrl + urlParam.url, { params: urlParam.params });
  }

  //create topic detail
  createTopicDetail(payload: any): Observable<any> {
    return this.getHttp.post(this.apiUrl + "agent/create_topic", payload);
  }

  //update topic details by topic id
  updateTopicDetailByID(urlPayload: any): Observable<any> {
    return this.getHttp.put(this.apiUrl + "agent/update_topic/" + urlPayload.ID, urlPayload.payload);
  }

  //get model details by model id
  getModelDetailByID(urlParam: any): Observable<any> {
    return this.getHttp.get(this.apiUrl + urlParam.url, { params: urlParam.param });
  }

  //get add capabilities by agent
  getCapabilitiesByAgent(urlParam: any): Observable<any> {
    return this.getHttp.get(this.apiUrl + urlParam.url, { params: urlParam.param });
  }

}
