import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class UserUtilsService {
    workFlow = environment.workFlowApiUrl + 'api/json-bpmn';
    authEndPoint = environment.userUtilsApi;

    constructor() {
    }

    config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    post(body: any, url: string) {
        return axios.post(this.authEndPoint + url, body);
    }

    getData(url: string) {
        return axios.get(this.authEndPoint + url, {
        });
    }

    login(body: any, url: string) {
        return axios.post(this.authEndPoint + url, body, this.config);
    }

}
