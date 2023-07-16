import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  endPoint = environment.xpilotUrl +"crud";
  private open: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public openSubmenu: Observable<boolean> = this.open.asObservable();
  constructor() {
  }

  falseOpen() {
    this.open.next(false);
  }

  trueOpen() {
    this.open.next(true);
  }

  getID(email: string) {
    return axios.get(this.endPoint + "/get_metadata/" + email);
  }

  getUsecase(email: String, id: String) {
    return axios.get(this.endPoint + "retrive_insights/" + email + "/" + id, {
    });
  }


  get(url: string) {
    return axios.get(this.endPoint + url, {
    });
  }

  getConversation(email: String, id: String) {
    return axios.get( this.endPoint + "get_conversation/" + email + "/" + id)
  }


}
