import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseApiService {
  constructor() {}
  abstract get apiUrl(): string;
  get(
    url: string,
    queryParams: Record<string, any> = {},
    config: AxiosRequestConfig = {}
  ) {
    return axios.get(this.apiUrl + url, {
      ...this.getConfigJsonHeader(config),
      params: queryParams,
    });
  }
  getApiData<T>(url: string, config: AxiosRequestConfig = {}) {
    return axios.get<T>(this.apiUrl + url, this.getConfigJsonHeader(config));
  }
  post(url: string, body: any = {}, config: AxiosRequestConfig = {}) {
    return axios.post(
      this.apiUrl + url,
      body,
      this.getConfigJsonHeader(config)
    );
  }
  fileUpload(url: string, body: any = {}, config: any) {
    return axios.post(this.apiUrl + url, body, config);
  }
  put(url: string, body: any = {}, config: AxiosRequestConfig = {}) {
    return axios.put(this.apiUrl + url, body, this.getConfigJsonHeader(config));
  }
  patch(url: string, body: any = {}, config: AxiosRequestConfig = {}) {
    return axios.patch(
      this.apiUrl + url,
      body,
      this.getConfigJsonHeader(config)
    );
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
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZDllMjBhMzctYThiZi00NGZjLTg5YzgtN2QzMDYyMGUzMjRhIiwiZmlyc3RfbmFtZSI6ImRpbGlwIiwibGFzdF9uYW1lIjoiY2hhbmRyYSIsImVtYWlsIjoiZGlsaXBjaGFuZHJhQHNhbGllbnRtaW5kcy5jb20iLCJlbnRpdHlfaWQiOiI0MDQ1NmRhNC0wYWQ1LTQ3ZmEtYWE2MC1hNTJlYjhlMGNiOGIiLCJlbnRpdHlfbmFtZSI6Inhub2RlLXRlY2giLCJhY2NvdW50X2lkIjoiMmE1N2U5MzEtYzJhOS00ODZlLWFhNmUtNTdjODJiMmI2NGQ1IiwiYWNjb3VudF9uYW1lIjoieG5vZGUtdGVjaCIsImFjY291bnRfdHlwZSI6InBlcnNvbmFsIiwicHJvZHVjdF90aWVyX2lkIjoiOGZhNTI5NWQtNDhjYy0xMWVlLWE3MTAtMzQ0MTVkOGI5MDFjIiwicHJvZHVjdF90aWVyX25hbWUiOiJCZXRhIiwiYWNjb3VudF9vd25lciI6IkZhbHNlIiwicm9sZV9pZCI6IjNhMDdmODExLTU4YjItNDQxMy1hMzY3LThlNWM4YjdjZTg3ZiIsInJvbGVfbmFtZSI6Ilhub2RlIEVudGl0eSBVc2VyIiwicGhvbmUiOiI2NTQ1NDIzMzQyMyJ9.CbyjBSRMqqGKvU9zpoD7iMIXq6pHK3RgjW2hp2bkaPg',
      },
    };
  }
}
