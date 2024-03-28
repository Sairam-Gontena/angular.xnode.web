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
    getConersationDetailById(params: any) {
        let queryParams = new HttpParams();
        Object.keys(params).forEach(key => {
            if (Array.isArray(params[key])) {
              queryParams = queryParams.append(key, params[key].join(','));
            } else {
              queryParams = queryParams.append(key, params[key]);
            }
          });
          let url = 'conversation';
          url += '?' + queryParams.toString();
      
        return this.get(url);
     }

    getMetaData(params: any) {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => {
            httpParams = httpParams.append(key, params[key]);
        });
        let url = 'product?' + httpParams;
        return this.get(url);
    }

    updateProductUrl(body: any) {
        return this.patch('product/update-url', body);
    }

}
