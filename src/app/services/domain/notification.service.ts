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
import { AppNotification } from 'src/types/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  pageSize = 15;
  paginatedPublications$: Observable<AppNotification[]> = new Observable<AppNotification[]>();
  lastDocument: any;

  constructor(
    private alert: AlertService,
    private http: HttpClient,
    private firestoreService: FirestoreService,
  ) {
    this.lastDocument = undefined;
  }

  getPromise(userId: string, notificationId: string) {
    return this.firestoreService.getDocumentPromise<AppNotification>(`users/${userId}/notifications/${notificationId}`);
  }

  add(userId: string, notificationId: string, notification: AppNotification) {
    return this.firestoreService.setDocument({
      path: `users/${userId}/notifications/${notificationId}`,
      body: notification,
    });
  }

  update(userId: string, notificationId: string, notification: AppNotification) {
    return this.firestoreService.updateDocument({
      path: `users/${userId}/notifications/${notificationId}`,
      body: notification,
    });
  }

  load(userId: string) {
    console.log('💡 userId::: ', userId);
    const collectionPath: string[] = ['notifications'];
    const queryConstraints: QueryConstraint[] = [orderBy('createdAt', 'asc')];

    return (this.paginatedPublications$ = this.firestoreService
      .getFilteredAndPaginatedCollection<AppNotification>(
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
    this.paginatedPublications$ = new Observable<AppNotification[]>();
    return this.load(userId);
  }

  loadMoreByUserId(userId: string) {
    return this.load(userId);
  }
}
