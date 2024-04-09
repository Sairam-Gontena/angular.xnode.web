import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpecApiService extends BaseApiService {
  override get apiUrl(): string {
    return environment.commentsApiUrl;
  }

  constructor(private httpClient: HttpClient) {
    super();
  }

  getSpec(params?: any) {
    let url = 'product-spec';
    return this.get(url, params);
  }

  getLatestSpec(productId?: any) {
    let url = 'product-spec/latest/' + productId;
    return this.get(url);
  }

  getVersionIds(product_id?: any) {
    let url = 'product-spec/version-ids/' + product_id;
    return this.get(url);
  }

  getUsecases(product_id?: any) {
    let url = 'product-spec/usecases/' + product_id;
    return this.get(url);
  }
  getDataModel(product_id?: any) {
    let url = 'product-spec/datamodel/' + product_id;
    return this.get(url);
  }

<<<<<<< Updated upstream
  getXflows(productId?: string) {
    let url = 'product-spec/xflows/' + productId;
    return this.get(url);
=======
  //get user list in spec os shared link
  getUserListProdSpec(params: any): Observable<any> {
    return this.httpClient.get<any>(this.apiUrl + 'product-spec', { params: params });
  }

  //share link to users in spec  
  createUpdateUserListProdSpec(paramPayload?: any) {
    let url = 'product-spec';
    return this.patch(url, paramPayload);
>>>>>>> Stashed changes
  }

}
