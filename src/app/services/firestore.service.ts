import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  docData,
  DocumentData,
  Firestore,
  getDocs,
  getDoc,
  limit,
  orderBy,
  Query,
  query,
  QueryConstraint,
  setDoc,
  startAfter,
  updateDoc,
  where,
  WithFieldValue,
  DocumentReference,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface DocumentRequest {
  path: string;
  body: WithFieldValue<DocumentData>;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  getDocument<T>(documentPath: string): Observable<T> {
    const userDocRef = doc(this.firestore, documentPath);
    return docData(userDocRef, { idField: 'idField' }) as Observable<T>;
  }

  async getDocumentPromise<T>(documentPath: string) {
    const userDocRef = doc(this.firestore, documentPath);
    return (await getDoc(userDocRef)).data() as T;
  }

  async setDocument(document: DocumentRequest) {
    try {
      const userDocRef = doc(this.firestore, document.path);
      await setDoc(userDocRef, document.body);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async updateDocument(document: DocumentRequest) {
    try {
      const userDocRef = doc(this.firestore, document.path);
      await updateDoc(userDocRef, document.body);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  getCollection<T>(name: string): Observable<T[]> {
    const ref = collection(this.firestore, name);
    return collectionData(ref, { idField: 'idField' }) as Observable<T[]>;
  }

  getFilteredCollection(collectionName: string, ...queryConstraints: QueryConstraint[]): Observable<any[]> {
    const q = query(collection(this.firestore, collectionName), ...queryConstraints);
    return new Observable<any[]>((observer) => {
      getDocs(q).then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        observer.next(data);
        observer.complete();
      });
    });
  }

  getFilteredAndPaginatedCollection<T>(
    collectionName: string,
    parentId: string,
    collectionPath: string[],
    pageSize: number,
    lastDocument?: any,
    ...queryConstraints: QueryConstraint[]
  ): Observable<T[]> {
    let collectionRef: CollectionReference | Query;
    if (parentId && collectionPath.length > 0) {
      collectionRef = collection(this.firestore, collectionName, parentId, ...collectionPath);
    } else {
      collectionRef = collection(this.firestore, collectionName);
    }

    let q = query(collectionRef, ...queryConstraints, limit(pageSize));
    if (lastDocument) {
      console.log('💡 lastDocument::: ', lastDocument);
      q = query(q, startAfter(lastDocument));
    }

    return new Observable<T[]>((observer) => {
      getDocs(q).then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const idField = doc.id;
          const documentData = doc.data();
          return { idField, ...documentData } as T;
        });
        observer.next(data);
        observer.complete();
      });
    });
  }
}
