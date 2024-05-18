import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from "socket.io-client";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: any;
  private readonly serverUrl: string = environment.webSocketUrl;

  constructor() {
    this.socket = io(this.serverUrl);
  }

  // Emit an event to the server
  emit(event: string, data: any): void {
    console.info('socket connected');
    this.socket.emit(event, data);
  }

  // Listen for events from the server
  onEvent(event: string): Observable<any> {
    return new Observable((observer: any) => {
      this.socket.on(event, (data: any) => observer.next(data));
    });
  }

}