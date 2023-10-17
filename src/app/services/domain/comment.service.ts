/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, scan } from 'rxjs';

import { AlertService } from '../alert.service';
import { FirestoreService } from '../firestore.service';
import { QueryConstraint, orderBy, where } from '@angular/fire/firestore';
import { Publication } from 'src/types/publication';
import { PublicationComment } from 'src/types/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  pageSize = 15;
  paginatedPublications$: Observable<PublicationComment[]> = new Observable<PublicationComment[]>();
  lastDocument: any;

  constructor(
    private alert: AlertService,
    private http: HttpClient,
    private firestoreService: FirestoreService,
  ) {
    this.lastDocument = undefined;
  }

  loadComments(publicationId: string) {
    const collectionPath = ['comments'];
    const queryConstraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    return (this.paginatedPublications$ = this.firestoreService
      .getFilteredAndPaginatedCollection<PublicationComment>(
        'publications',
        publicationId,
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

  loadCommentsByPublicationId(publicationId: string) {
    this.lastDocument = undefined;
    console.log('💡 lastDocument::: ', this.lastDocument)
    this.paginatedPublications$ = new Observable<PublicationComment[]>();
    return this.loadComments(publicationId);
  }

  loadMoreCommentsByPublicationId(publicationId: string) {
    return this.loadComments(publicationId);
  }
}
