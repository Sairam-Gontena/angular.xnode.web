import { Injectable } from '@angular/core';
import axios from 'axios';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  getID(email: String) {
    return axios.get('https://xpilot.azurewebsites.net/docs#/default/get_meta_data_crud_get_metadata__email__get', {
      params: { email: email}
    });
  }

  getUsecase(email: String, id: String) {
    return axios.get('https://xpilot.azurewebsites.net/docs#/default/read_insights_data_crud_retrive_insights__email___id__get', {
      params: {
        email: email,
        id: id
      }
    });
  }

 

}
