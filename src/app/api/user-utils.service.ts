import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({
    providedIn: 'root'
})

export class UserUtilsService extends BaseApiService {

    override get apiUrl(): string {
        return environment.userUtilsApi;
    }
    constructor() {
        super();
    }
    getData(url: string) {
        return axios.get(this.apiUrl + url);
    }
    login(body: any, url: string) {
        return this.post(url, body);
    }

}
