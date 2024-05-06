import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('ACCESS_TOKEN');
      if (token) {
        config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      }
      return config;
    });
  }

  abstract get apiUrl(): string;

  get(
    url: string,
    queryParams: Record<string, any> = {},
    config: AxiosRequestConfig = {}
  ) {
    return this.axiosInstance.get(this.apiUrl + url, {
      ...this.getConfigJsonHeader(config),
      params: queryParams,
    });
  }

  getApiData<T>(url: string, config: AxiosRequestConfig = {}) {
    return this.axiosInstance.get<T>(
      this.apiUrl + url,
      this.getConfigJsonHeader(config)
    );
  }

  post(url: string, body: any = {}, config: AxiosRequestConfig = {}) {
    return this.axiosInstance.post(
      this.apiUrl + url,
      body,
      this.getConfigJsonHeader(config)
    );
  }

  fileUpload(url: string, body: any = {}, config: any) {
    return this.axiosInstance.post(this.apiUrl + url, body, config);
  }

  put(url: string, body: any = {}, config: AxiosRequestConfig = {}) {
    return this.axiosInstance.put(
      this.apiUrl + url,
      body,
      this.getConfigJsonHeader(config)
    );
  }

  patch(url: string, body: any = {}, config: AxiosRequestConfig = {}) {
    return this.axiosInstance.patch(
      this.apiUrl + url,
      body.payload,
      { ...this.getConfigJsonHeader(config), params: body.param }
    );
  }

  delete(url: string, config: AxiosRequestConfig = {}) {
    return this.axiosInstance.delete(
      this.apiUrl + url,
      this.getConfigJsonHeader(config)
    );
  }

  getConfigJsonHeader(config: AxiosRequestConfig): AxiosRequestConfig {
    if (config?.headers?.hasContentType) {
      return config;
    }
    return {
      headers: {
        'Content-Type': 'application/json',
        'ocp-apim-subscription-key': 'dfa5a9e0fbfa43809ea3e6212647dd53',

      },
    };
  }
}
