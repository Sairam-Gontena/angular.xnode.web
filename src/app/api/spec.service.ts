import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class SpecService extends BaseApiService {
    override get apiUrl(): string {
        return environment.commentsApiUrl;
    }

    constructor() {
        super();
    }

    getSpec(params?: any) {
        let url = 'product-spec';
        return this.get(url, params)
    }
    getVersionIds(params?: any) {
        let url = 'product-spec/version-ids/' + params;
        return this.get(url)
    }
}

