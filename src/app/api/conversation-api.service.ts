import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({
    providedIn: 'root',
})
export class ConversationApiService extends BaseApiService {
    override get apiUrl(): string {
        return environment.apiUrl + environment.endpoints.conversation;
    }

    constructor() {
        super();
    }

    getAllConversations() {
        let url = '/conversation';
        return this.get(url);
    }

    getConversationsByContributor() {
        let url = '/conversation/conversations-by-contributor';
        return this.get(url);
    }

}