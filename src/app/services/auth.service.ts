// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.authApiUrl; // Replace with your API URL
    private token: string | null = null;

    login(body: any) {
        return axios.post(`${this.apiUrl}/login`, body);
    }

    logout(): void {
        this.token = null;
    }

    setToken(token: string): void {
        this.token = token;
    }

    getToken(): string | null {
        return this.token;
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }
}
