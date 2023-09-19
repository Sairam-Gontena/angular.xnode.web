import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class CommonApiService {
    endPoint = environment.commonApiUrl

    post(url: string, body: unknown, headers: any) {
        return axios.post(this.endPoint + url, body, { headers })
    }
    get(url: string, body: unknown) {
        return axios.get(this.endPoint + url)
    }
}