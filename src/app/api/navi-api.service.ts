import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class NaviApiService extends BaseApiService {
  override get apiUrl(): string {
    return environment.apiUrl;
  }
  constructor() {
    super();
  }

  getMetaData(email?: string, productId?: string) {
    let url = 'navi/get_metadata/' + email;
    if (productId) url = url + '/' + productId;
    return this.get(url);
  }
  getTotalOnboardedApps(email?: string) {
    let url = 'navi/total_apps_onboarded/' + email;
    return this.get(url);
  }

  getTotalPublishedApps(accountId?: string) {
    let url = 'navi/total_apps_published/' + accountId;
    return this.get(url);
  }
  updateProductUrl(body?: any) {
    let url = 'navi/update_product_url';
    return this.patch(url, body);
  }
  getXflows(email?: string, productId?: string) {
    if(!productId){
      productId = '';
    }else{
      productId = '/' + productId
    }
    let url = 'navi/get_xflows/' + email + productId;
    return this.get(url);
  }
  getOverview(email?: string, productId?: string) {
    let url = 'navi/get_overview/' + email + '/' + productId;
    return this.get(url);
  }
  getDataModels(productId?: string) {
    let url = 'navi/get_datamodels/' + productId;
    return this.get(url);
  }
  getEntireData(email?: string, productId?: string) {
    let url = 'navi/get_entire_data/' + email + '/' + productId;
    return this.get(url);
  }

  getConversation(email?: string, productId?: string) {
    let url = 'navi/get_entire_data/' + email + '/' + productId;
    return this.get(url);
  }

  getInsights(productId?: string) {
    let url = 'navi/get_insights/' + productId;
    return this.get(url);
  }

  persistConversation(body?: any) {
    let url = 'bot/persist_conversation';
    return this.post(url, body);
  }
  retriveNotifications(params?: any) {
    let url = 'notifications/retrieve/' + environment.branchName;
    return this.get(url, params);
  }

  getUsecases(productId?: string) {
    let url = 'navi/get_usecases/' + productId;
    return this.get(url);
  }

  generateSpec(body?: any) {
    let url = 'specs/generate';
    return this.post(url, body);
  }

  updateSpec(body?: any) {
    let url = 'specs/update';
    return this.post(url, body);
  }
}
