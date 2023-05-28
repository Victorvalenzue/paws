import { Injectable } from '@angular/core';

import { AlertService } from './alert.service';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private alert: AlertService, private navigation: NavigationService) {}

  public set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public get<T>(key: string): T | null {
    const value = localStorage.getItem(key);

    return value ? (JSON.parse(value) as T) : null;
  }

  public clear() {
    localStorage.clear();
  }

  private b64ToUTF8(text: string) {
    return decodeURIComponent(escape(window.atob(text)));
  }
}
