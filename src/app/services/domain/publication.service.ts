/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, scan } from 'rxjs';

import { AlertService } from '../alert.service';
import { FirestoreService } from '../firestore.service';
import { QueryConstraint, orderBy, where } from '@angular/fire/firestore';
import { Publication } from 'src/types/publication';
import { AdoptionApplicant } from 'src/types/adoption-applicant';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  pageSize = 2;
  paginatedPublications$: Observable<Publication[]> = new Observable<Publication[]>();
  lastDocument: any;

  constructor(
    private alert: AlertService,
    private http: HttpClient,
    private firestoreService: FirestoreService,
  ) {}

  getAdoptionApplicant(pubId: string, applicantId: string) {
    return this.firestoreService.getDocument<AdoptionApplicant>(`publications/${pubId}/applicants/${applicantId}`);
  }

  getAdoptionApplicantPromise(pubId: string, applicantId: string) {
    return this.firestoreService.getDocumentPromise<AdoptionApplicant>(
      `publications/${pubId}/applicants/${applicantId}`,
    );
  }

  add(id: string, pub: Publication) {
    return this.firestoreService.setDocument({ path: `publications/${id}`, body: pub });
  }

  addAdoptionApplicant(pubId: string, applicantId: string, applicant: AdoptionApplicant) {
    return this.firestoreService.setDocument({
      path: `publications/${pubId}/applicants/${applicantId}`,
      body: applicant,
    });
  }

  loadPublications(userTags: string[]) {
    const collectionPath: string[] = [];
    const queryConstraints: QueryConstraint[] = [
      where('tags', 'array-contains-any', userTags),
      orderBy('createdAt', 'desc'),
    ];

    return (this.paginatedPublications$ = this.firestoreService
      .getFilteredAndPaginatedCollection<Publication>(
        'publications',
        '',
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

  loadPublicationsByUserTags(userTags: string[]) {
    this.lastDocument = undefined;
    this.paginatedPublications$ = new Observable<Publication[]>();
    return this.loadPublications(userTags);
  }

  loadMorePublicationsByUserTags(userTags: string[]) {
    return this.loadPublications(userTags);
  }
}
