import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  browserLocalPersistence,
  setPersistence,
  Persistence,
  browserSessionPersistence,
  User,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from '@angular/fire/auth';
import { GoogleAuthProvider } from 'firebase/auth';

import { LocalStorageService } from './local-storage.service';
import { USER_CACHE_SESSION } from 'src/utils/constants';
import { AppUser } from 'src/types/app-user';
import { CasheUser } from 'src/types/cache';
import { Capacitor } from '@capacitor/core';
import { FirestoreService } from './firestore.service';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private localStorage: LocalStorageService,
    private document: FirestoreService,
    private analytics: AngularFireAnalytics,
  ) {}

  async persistInitialInfo(name: string, email: string, uid: string) {
    try {
      const profile: AppUser = {
        profileId: name.toLocaleLowerCase().trim().replace(' ', '') + new Date(),
        profileImageURL: '',
        profileName: name,
        active: true,
        bio: '',
        createdAt: +new Date(),
        followers: 0,
        following: 0,
        email: email,
        publications: 0,
        verified: false,
        tags: [],
        likes: [],
      };
      await this.document.setDocument({ path: `users/${uid}`, body: profile });
    } catch (e) {
      console.error(JSON.stringify(e));
    }
  }

  async register({ email, password, name }: { email: string; password: string; name: string }) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      const currentUser = this.auth.currentUser;
      if (!!currentUser) {
        await this.persistInitialInfo(name, email, currentUser.uid);
      }
      return user;
    } catch (e) {
      console.error(JSON.stringify(e));
      return null;
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      if (!Capacitor.isNativePlatform()) {
        const currentUser = this.auth.currentUser;
        if (!currentUser) {
          return;
        }
        this.analytics.setUserId(currentUser?.uid);
        this.localStorage.set(USER_CACHE_SESSION, currentUser);
      }
      return user;
    } catch (e) {
      console.error(JSON.stringify(e));
      return null;
    }
  }

  logout() {
    this.localStorage.clear();
    return signOut(this.auth);
  }

  async getAuthState() {
    if (!Capacitor.isNativePlatform()) {
      console.log('not native flow');
      const user = this.localStorage.get<CasheUser>(USER_CACHE_SESSION);
      if (!!user) {
        const currentDate = new Date();
        const expirationTime = await user.stsTokenManager.expirationTime;
        const expirationDate = new Date(expirationTime);
        console.log('💡 expirationDate::: ', expirationDate);
        if (expirationDate > currentDate) {
          console.log('El token aún no ha expirado.');
          return user;
        } else {
          console.log('El token ha expirado.');
          return user;
        }
      }
    }
    return this.auth.currentUser;
  }

  GoogleAuth() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(this.auth, provider);

    // return signInWithPopup(this.auth, provider)
    //   .then((result) => {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     const credential = GoogleAuthProvider.credentialFromResult(result);
    //     const token = credential?.accessToken;
    //     // The signed-in user info.
    //     const user = result.user;
    //     // IdP data available using getAdditionalUserInfo(result)
    //     // ...
    //     const currentUser = this.auth.currentUser;
    //     if (!!currentUser) {
    //       this.document.getDocument<Profile>(`users/${currentUser.uid}`).subscribe((data) => {
    //         console.log('💡 exist data::: ', data);
    //         if (!data){
    //           console.log('no existing data for google user')
    //           this.persistInitialInfo(currentUser?.displayName || '', currentUser?.email || '', currentUser.uid);
    //         }
    //       });
    //     }
    //     return user;
    //   })
    //   .catch((error) => {
    //     // Handle Errors here.
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // The email of the user's account used.
    //     const email = error.customData.email;
    //     // The AuthCredential type that was used.
    //     const credential = GoogleAuthProvider.credentialFromError(error);
    //     // ...
    //     console.error(JSON.stringify(error));
    //     return null;
    //   });
  }

  continueGoogleAuth() {
    return getRedirectResult(this.auth)
      .then((result) => {
        console.log('💡 getRedirectResult::: ');
        if (!result) return null;
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        // The signed-in user info.
        const user = result?.user;
        console.log('💡 user::: ', user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        const currentUser = this.auth.currentUser;
        if (!!currentUser) {
          this.document.getDocument<AppUser>(`users/${currentUser.uid}`).subscribe((data) => {
            console.log('💡 exist data::: ', data);
            if (!data) {
              console.log('no existing data for google user');
              this.persistInitialInfo(currentUser?.displayName || '', currentUser?.email || '', currentUser.uid);
            }
            if (!Capacitor.isNativePlatform()) {
              this.localStorage.set(USER_CACHE_SESSION, currentUser);
            }
          });
        }
        return user;
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.error(JSON.stringify(error));
        return null;
      });
  }
}
