import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { InterComponentMessage } from 'src/models/inter-component-message';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private messageSubject: Subject<InterComponentMessage<any>> = new Subject<InterComponentMessage<any>>();
  constructor() { }
  sendMessage<T>(message: InterComponentMessage<T>) {
    this.messageSubject.next(message);
  }
  getMessage<T>(): Observable<InterComponentMessage<T>> {
    return this.messageSubject.asObservable().pipe(map((data: InterComponentMessage<any>) => {
      let msg: InterComponentMessage<T> = {
        msgType: data.msgType,
        msgData: data.msgData as T
      };
      return msg;
    }));
  }
}
