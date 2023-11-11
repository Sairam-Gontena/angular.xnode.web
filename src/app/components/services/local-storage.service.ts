import { Injectable } from '@angular/core';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  saveItem<T>(key: StorageKeys, data: T) {
    const dataString = JSON.stringify(data);
    localStorage.setItem(key, dataString);
  }
  getItem<T>(key: StorageKeys): T | undefined {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      }
      catch (error) {
        console.log(`Failed to parse data with key - ${key}`);
        console.error(error);
        return undefined;
      }
    }
    return undefined;
  }
  removeItem(key: StorageKeys) {
    localStorage.removeItem(key);
  }
}
