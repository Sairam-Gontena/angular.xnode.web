import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {
  constructor() {
  }
  abstract get apiUrl(): string;
  get(url: string, queryParams: Record<string, any> = {}, config: AxiosRequestConfig = {}) {
    return axios.get(this.apiUrl + url, {
      ...this.getConfigJsonHeader(config),
      params: queryParams,
    });
  }
  getApiData<T>(url: string, config: AxiosRequestConfig = {}) {
    return axios.get<T>(this.apiUrl + url, this.getConfigJsonHeader(config));
  }
  post(url: string, body: any = {}, config: AxiosRequestConfig = {}) {
    return axios.post(this.apiUrl + url, body, this.getConfigJsonHeader(config));
  }
  fileUpload(url: string, body: any = {}, config: any) {
    return axios.post(this.apiUrl + url, body, config);
  }
  put(url: string, body: any = {}, config: AxiosRequestConfig = {}) {
    return axios.post(this.apiUrl + url, body, this.getConfigJsonHeader(config));
  }
  patch(url: string, body: any = {}, config: AxiosRequestConfig = {}) {
    return axios.patch(this.apiUrl + url, body, this.getConfigJsonHeader(config));
  }
  delete(url: string, config: AxiosRequestConfig = {}) {
    return axios.delete(this.apiUrl + url, this.getConfigJsonHeader(config));
  }
  getConfigJsonHeader(config: AxiosRequestConfig): AxiosRequestConfig {
    if (config?.headers?.hasContentType) {
      return config;
    }
    return {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
}
