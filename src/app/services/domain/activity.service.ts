/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, scan } from 'rxjs';

import { AlertService } from '../alert.service';
import { FirestoreService } from '../firestore.service';
import { QueryConstraint, orderBy, where } from '@angular/fire/firestore';
import { Publication } from 'src/types/publication';
import { PublicationComment } from 'src/types/comment';
import { Pet } from 'src/types/pet';
import { UserActivity } from 'src/types/user-activity';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  pageSize = 15;
  paginatedPublications$: Observable<UserActivity[]> = new Observable<UserActivity[]>();
  lastDocument: any;

  constructor(
    private alert: AlertService,
    private http: HttpClient,
    private firestoreService: FirestoreService,
  ) {
    this.lastDocument = undefined;
  }

  getPromise(userId: string, activityId: string) {
    return this.firestoreService.getDocumentPromise<UserActivity>(`users/${userId}/activities/${activityId}`);
  }

  add(userId: string, activityId: string, activity: UserActivity) {
    return this.firestoreService.setDocument({ path: `users/${userId}/activities/${activityId}`, body: activity });
  }

  update(userId: string, activityId: string, activity: UserActivity) {
    return this.firestoreService.updateDocument({ path: `users/${userId}/activities/${activityId}`, body: activity });
  }

  load(userId: string) {
    console.log('💡 userId::: ', userId);
    const collectionPath: string[] = ['activities'];
    const queryConstraints: QueryConstraint[] = [orderBy('createdAt', 'asc')];

    return (this.paginatedPublications$ = this.firestoreService
      .getFilteredAndPaginatedCollection<UserActivity>(
        'users',
        userId,
        collectionPath,
        this.pageSize,
        this.lastDocument,
        ...queryConstraints,
      )
      .pipe(
        map((filteredData) => {
          if (filteredData.length > 0) {
            this.lastDocument = filteredData[filteredData.length - 1].createdAt;
          }
          return filteredData;
        }),
      ));
  }

  loadByUserId(userId: string) {
    this.lastDocument = undefined;
    this.paginatedPublications$ = new Observable<UserActivity[]>();
    return this.load(userId);
  }

  loadMoreByUserId(userId: string) {
    return this.load(userId);
  }
}
