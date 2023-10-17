/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, scan } from 'rxjs';

import { AlertService } from '../alert.service';
import { FirestoreService } from '../firestore.service';
import { QueryConstraint, orderBy, where } from '@angular/fire/firestore';
import { Publication } from 'src/types/publication';
import { PublicationComment } from 'src/types/comment';
import { CommentReply } from 'src/types/reply';

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  pageSize = 15;
  paginatedPublications$: Observable<CommentReply[]> = new Observable<CommentReply[]>();
  lastDocument: any;

  constructor(
    private alert: AlertService,
    private http: HttpClient,
    private firestoreService: FirestoreService,
  ) {}

  loadReplies(publicationId: string, commentId: string) {
    const collectionPath = ['comments', commentId, 'replies'];
    const queryConstraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    return (this.paginatedPublications$ = this.firestoreService
      .getFilteredAndPaginatedCollection<CommentReply>(
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

  loadRepliesByCommentId(publicationId: string, commentId: string) {
    this.lastDocument = undefined;
    this.paginatedPublications$ = new Observable<CommentReply[]>();
    return this.loadReplies(publicationId, commentId);
  }

  loadMoreRepliesByCommentId(publicationId: string, commentId: string) {
    return this.loadReplies(publicationId, commentId);
  }
}
