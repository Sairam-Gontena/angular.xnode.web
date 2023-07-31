import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: any;
  private readonly serverUrl: string = 'https://notify-now.azurewebsites.net'; // Replace with your WebSocket server URL

  constructor() {
    this.socket = io(this.serverUrl);
  }

  // Emit an event to the server
  emit(event: string, data: any): void {
    console.log('socket connected');
    this.socket.emit(event, data);
  }

  // Listen for events from the server
  onEvent(event: string): Observable<any> {
    return new Observable((observer: any) => {
      this.socket.on(event, (data: any) => observer.next(data));
    });
  }
}