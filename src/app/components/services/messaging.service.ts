import { Injectable } from '@angular/core';
import { InterComponentMessage } from 'src/models/inter-component-message';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private messageSubject: BehaviorSubject<InterComponentMessage<any>> = new BehaviorSubject<InterComponentMessage<any>>({
    msgData: undefined,
    msgType: undefined
  });
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
