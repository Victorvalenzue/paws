/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { AlertService } from '../alert.service';

import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { coreHeaders } from 'src/utils/core';
import { Breed } from 'src/types/breed';

@Injectable({
  providedIn: 'root',
})
export class PawsService {
  _breeds = new BehaviorSubject<Breed[]>([]);
  apiUrl = environment.apiURL;
  constructor(private alert: AlertService, private http: HttpClient) {}

  get breeds(): any[] {
    return this._breeds.value;
  }

  getBreeds(): Observable<Breed[]> {
    const headers = new HttpHeaders({
      ...coreHeaders,
    });
    return this.http.get<any[]>(`${this.apiUrl}breed`, { headers });
  }
}
