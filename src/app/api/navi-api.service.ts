import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class NaviApiService extends BaseApiService {
  override get apiUrl(): string {
    return environment.apiUrl + environment.endpoints.navi;
  }
  constructor() {
    super();
  }

  getMetaData(email?: string, productId?: string) {
    let url = '/navi/get_metadata/' + email;
    if (productId) url = url + '/' + productId;
    return this.get(url);
  }
  getTotalOnboardedApps(email?: string) {
    let url = '/navi/total_apps_onboarded/' + email;
    return this.get(url);
  }

  getTotalPublishedApps(accountId?: string) {
    let url = '/navi/total_apps_published/' + accountId;
    return this.get(url);
  }

  getXflows(email?: string, productId?: string) {
    let url = '/navi/get_xflows/' + email + '/' + productId;
    return this.get(url);
  }
  getOverview(email?: string, productId?: string) {
    let url = '/navi/get_overview/' + email + '/' + productId;
    return this.get(url);
  }
  getDataModels(productId?: string) {
    let url = '/navi/get_datamodels/' + productId;
    return this.get(url);
  }
  getEntireData(email?: string, productId?: string) {
    let url = '/navi/get_entire_data/' + email + '/' + productId;
    return this.get(url);
  }

  getConversation(email?: string, productId?: string) {
    let url = '/navi/get_entire_data/' + email + '/' + productId;
    return this.get(url);
  }

  getInsights(productId?: string) {
    let url = '/navi/get_insights/' + productId;
    return this.get(url);
  }

  persistConversation(body?: any) {
    let url = '/bot/persist_conversation';
    return this.post(url, body);
  }
  retriveNotifications(params?: any) {
    let url = '/notifications/retrieve/' + environment.branchName;
    return this.get(url, params);
  }

  getUsecases(productId?: string) {
    let url = '/navi/get_usecases/' + productId;
    return this.get(url);
  }

  getSummaryByProductId(productId?: string) {
    let url = '/navi/get_summary/' + productId;
    return this.get(url);
  }

  generateSpec(body?: any) {
    let url = '/specs/generate';
    return this.post(url, body);
  }

  updateSpec(body?: any) {
    let url = '/specs/update';
    return this.post(url, body);
  }
  postFile(body: unknown) {
    const url = '/bot/process_file'
    return this.post(url, body)
  }
}
