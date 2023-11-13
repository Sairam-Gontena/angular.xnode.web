import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({
    providedIn: 'root'
})

export class CommonApiService extends BaseApiService {
    override get apiUrl(): string {
        return environment.commonApiUrl;
    }
    postFile(url: string, body: unknown, headers: any) {
        return this.fileUpload(url, body, { headers });
    }

}