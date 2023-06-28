import { Injectable } from '@angular/core';
import axios from 'axios';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getID(email: String) {
    return axios.get('https://xpilot.azurewebsites.net/crud/get_metadata/' + email);
  }

  getUsecase(email: String, id: String) {
    console.log(id, 'id');

    return axios.get('https://xpilot.azurewebsites.net/crud/retrive_insights/' + email + "/" + id, {
    });
  }



}
