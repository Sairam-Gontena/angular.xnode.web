import { Injectable } from '@angular/core';
import axios from 'axios';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  endPoint = "https://xpilot.azurewebsites.net/crud";
  constructor() { }

  getID(email: String) {
    return axios.get('https://xpilot.azurewebsites.net/crud/get_metadata/' + email);
  }

  getUsecase(email: String, id: String) {
    console.log(id, 'id');

    return axios.get('https://xpilot.azurewebsites.net/crud/retrive_insights/' + email + "/" + id, {
    });
  }

  get(url: string) {
    return axios.get(this.endPoint + url, {
    });
  }

  getConversation(email: String, id: String) {
    return axios.get('https://xpilot.azurewebsites.net/crud/get_conversation/' +email + "/" + id);
  }


}
