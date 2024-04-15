import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { XnodeConversation } from '../models/interfaces/xnode-conversation';
import { BehaviorSubject, Observable, Subject, catchError, map, throwError } from 'rxjs';
import axios from 'axios';
import { BaseApiService } from './base-api.service';
import { AuthApiService } from './auth.service';
import { LocalStorageService } from '../components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';


@Injectable({
    providedIn: 'root'
})


export class ConversationHubService extends BaseApiService {
        override get apiUrl(): string {
        return environment.conversationApiUrl;
    }
    constructor(private httpClient: HttpClient, private authApiService: AuthApiService, private storageService: LocalStorageService) {
        super();
        this.getAllUsers();
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
    getAllUsers() {
        let currentUSer:any =  localStorage.getItem('currentUser');
          currentUSer = JSON.parse(currentUSer);
          let account_id = currentUSer.account_id;
          this.authApiService.getAllUsers(account_id).then((response: any) => {
            if (response && response.data) {
              response.data.forEach((element: any) => { element.name = element.first_name + ' ' + element.last_name });
              this.storageService.saveItem(StorageKeys.USERLIST, response.data);
            }
          })
      }

    getResourcesByUserId(params: any) {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => {
          httpParams = httpParams.append(key, params[key]);
        });
        let url = 'resource/resources-by-user?'+httpParams;
        return this.get(url);
    }

    getResources(params: any) {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => {
          httpParams = httpParams.append(key, params[key]);
        });
        return this.httpClient.get(`${this.rootUrl}resource`, { params: httpParams });
    }
}
