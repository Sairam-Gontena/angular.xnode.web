import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, from } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { AuthApiService } from './auth.service';
import { LocalStorageService } from '../components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Injectable({
  providedIn: 'root'
})


export class ConversationHubService extends BaseApiService {
  override get apiUrl(): string {
    return environment.apiUrl + environment.endpoints.conversation;
  }
  constructor(private httpClient: HttpClient, private authApiService: AuthApiService, private storageService: LocalStorageService) {
    super();
  }
  rootUrl = environment.apiUrl + environment.endpoints.conversation;

  getConversations(params: any) {
    let url = '/conversation' + params;
    return this.get(url);
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
    let url = '/conversation';
    url += '?' + queryParams.toString();

    return this.get(url);
  }

  getMetaData(params: any) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, params[key]);
    });
    let url = '/product?' + httpParams;
    return this.get(url);
  }

  getProductsByUser(params: any) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, params[key]);
    });
    let url = '/product/products-by-user?' + httpParams;
    return this.get(url);
  }

  updateProductUrl(obj: any, id: string) {
    const body = { payload: obj, params: { id: id } }
    return this.patchProductUrl('/product', body);
  }

  getAllUsers() {
    let currentUSer: any = localStorage.getItem('currentUser');
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
    let url = '/resource/resources-by-user?' + httpParams;
    return this.get(url);
  }

  getResources(params: any) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, params[key]);
    });
    return this.httpClient.get(`${this.rootUrl}/resource`, { params: httpParams });
  }

  patchProduct(product_id: string, params: any) {
    const url = `${this.rootUrl}/product?id=${product_id}`;
    const authToken = this.storageService.getItem(StorageKeys.ACCESS_TOKEN)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ocp-apim-subscription-key': environment.apimSubscriptionKey,
      'Authorization': `Bearer ${authToken}` // Include the token in the 'Authorization' header
    });
    return this.httpClient.patch(url, params, { headers });
  }

  getRecentActivities(userId: any) {
    return from(this.get(`/user-activity?`, { userId }));
  }
}
