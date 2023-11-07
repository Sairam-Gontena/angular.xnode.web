import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({
    providedIn: 'root'
})
export class NotifyApiService extends BaseApiService {
    override get apiUrl(): string {
        return  environment.notifyApiUrl;
    }
    constructor() {
        super();
    }
}
