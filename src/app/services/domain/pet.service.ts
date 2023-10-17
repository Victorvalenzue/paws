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

@Injectable({
  providedIn: 'root',
})
export class PetService {
  pageSize = 15;
  paginatedPublications$: Observable<Pet[]> = new Observable<Pet[]>();
  lastDocument: any;

  constructor(
    private alert: AlertService,
    private http: HttpClient,
    private firestoreService: FirestoreService,
  ) {
    this.lastDocument = undefined;
  }

  add(id: string, pet: Pet) {
    return this.firestoreService.setDocument({ path: `pets/${id}`, body: pet });
  }

  load(ownerId: string) {
    console.log('💡 ownerId::: ', ownerId);
    const collectionPath: string[] = [];
    const queryConstraints: QueryConstraint[] = [where('ownerId', '==', ownerId), orderBy('createdAt', 'desc')];

    return (this.paginatedPublications$ = this.firestoreService
      .getFilteredAndPaginatedCollection<Pet>(
        'pets',
        ownerId,
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

  loadPetsByOwnerId(ownerId: string) {
    this.lastDocument = undefined;
    this.paginatedPublications$ = new Observable<Pet[]>();
    return this.load(ownerId);
  }

  loadMorePetsByOwnerId(ownerId: string) {
    return this.load(ownerId);
  }
}
