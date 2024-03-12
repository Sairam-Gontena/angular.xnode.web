import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { XnodeConversation } from '../models/interfaces/xnode-conversation';
import { BehaviorSubject, Observable, Subject, catchError, map, throwError } from 'rxjs';
import axios from 'axios';
import { BaseApiService } from './base-api.service';


@Injectable({
    providedIn: 'root'
})
export class ConversationHubService extends BaseApiService {
    override get apiUrl(): string {
        return environment.conversationApiUrl;
    }
    constructor() {
        super();
    }
    rootUrl = environment.conversationApiUrl;
    private isNaviExpandedSubject = new BehaviorSubject<any>(false);

    getConversations(params: any) {
        let url = 'conversation' + params;
        return this.get(url);
        // return axios.get(this.rootUrl + 'conversation' + params);
        // Make the GET request with the parameters
        // return this.httpClient.get<any[]>(`${this.rootUrl}conversation`, { params: httpParams });
    }

    // getConversationsHttp(productId?: string) {
    //     return this.httpClient.get(`${this.rootUrl}conversation`)
    // }

    // getConversationsByAccountId(id: string) {
    //     return this.httpClient.get(`${this.rootUrl}conversation?accountId=${id}`)
    // }
    // // getConversation(id: string): Observable<XnodeConversation> {
    // //   return this.httpClient.get<XnodeConversation[]>(`${this.rootUrl}/conversation?id=${id}`)
    // //     .pipe(map(conversations => conversations[0]));
    // // }
    // post(url: string, body: unknown) {
    //     return this.httpClient.post(this.rootUrl + url, body)
    // }

}
