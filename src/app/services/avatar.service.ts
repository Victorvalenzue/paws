import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { v4 as uuid } from 'uuid';

import { StorageRequest, StorageService } from './storage.service';
import { FirestoreService } from './firestore.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { LoadingService } from './loading.service';
import { AlertService } from './alert.service';
import { errorSignIn, errorWithServices } from 'src/utils/alerts';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor(
    private auth: Auth,
    private storage: StorageService,
    private document: FirestoreService,
    private loadingService: LoadingService,
    private alertService: AlertService,
  ) {}

  async changeProfileImage(id: string, collection: string, cameraSource: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        width: 400,
        height: 400,
        source: cameraSource,
        promptLabelPhoto: 'Desde Galería',
        promptLabelPicture: 'Tomar foto',
        promptLabelCancel: 'Cancelar',
        promptLabelHeader: 'Selección de foto',
      });

      if (!image?.base64String) return false;

      await this.loadingService.present();
      const result = await this.uploadProfileImage(collection, id, image.base64String);
      await this.loadingService.dismiss();

      if (!result) {
        this.alertService.presentToast(errorWithServices);
      }
      return result;
    } catch (e) {
      console.error(e);
      this.alertService.presentToast(errorWithServices);
      return false;
    }
  }

  async setProfileImage(id: string, collection: string, fileName: string, image: Photo) {
    try {
      if (!image?.base64String) return '';

      await this.loadingService.present();
      const result = await this.uploadImageToStorage(id, collection, fileName, image.base64String);
      await this.loadingService.dismiss();

      if (!result) {
        this.alertService.presentToast(errorWithServices);
      }
      return result;
    } catch (e) {
      console.error(e);
      this.alertService.presentToast(errorWithServices);
      return '';
    }
  }

  async uploadImageToStorage(id: string, collection: string, filename: string, base64String: string) {
    const path = `uploads/${id}/${collection}/${filename}.webp`;
    const file: StorageRequest = {
      content: base64String,
      fullPath: path,
      type: 'base64',
    };

    const imageURL = await this.storage.upload(file);
    return imageURL ? imageURL : '';
  }

  async uploadProfileImage(collection: string, id: string, base64String: string) {
    const path = `uploads/${id}/profile/profile.webp`;
    const file: StorageRequest = {
      content: base64String,
      fullPath: path,
      type: 'base64',
    };

    const profileImageURL = await this.storage.upload(file);
    const setDoc = await this.document.updateDocument({
      path: `${collection}/${id}`,
      body: {
        profileImageURL,
      },
    });
    return setDoc;
  }

  async updateProfileImage(collection: string, id: string, profileImageURL: string) {
    const setDoc = await this.document.updateDocument({
      path: `${collection}/${id}`,
      body: {
        profileImageURL,
      },
    });
    return setDoc;
  }

  getProfilePhotoUrl(userId: string): string {
    const storageBaseUrl = `https://firebasestorage.googleapis.com/v0/b/${environment.firebase.storageBucket}`;
    const photoPath = encodeURIComponent(`uploads/${userId}/profile/profile.webp`);
    const token = uuid();

    return `${storageBaseUrl}/o/${photoPath}?alt=media&token=${token}`;
  }
}
