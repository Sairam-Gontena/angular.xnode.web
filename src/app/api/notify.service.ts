import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotifyApiService {
    endPoint = environment.notifyApiUrl;
    constructor() {
    }
    config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    get(url: string) {
        return axios.get(this.endPoint + url, {
        });
    }

    post(body: any, url: string) {
        return axios.post(this.endPoint + url, body, this.config);
    }
}
