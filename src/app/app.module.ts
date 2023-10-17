import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth, indexedDBLocalPersistence, initializeAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagInputModule } from 'ngx-chips';

TagInputModule.withDefaults({
  tagInput: {
    placeholder: 'Agregar palabra',
    secondaryPlaceholder: 'Agregar palabra',
    // add here other default values for tag-input
  },
});

import { AppRoutingModule } from './app-routing.module';

import { AlertService } from './services/alert.service';
import { LoadingService } from './services/loading.service';
import { NavigationService } from './services/navigation.service';
import { LocalStorageService } from './services/local-storage.service';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { ModalService } from './services/modal.service';
import { ProfilePageModule } from './pages/profile/profile.module';
import { PhotoService } from './services/avatar.service';
import { Capacitor } from '@capacitor/core';
import { StorageService } from './services/storage.service';
import { FirestoreService } from './services/firestore.service';
import { PublicationService } from './services/domain/publication.service';
import { DeviceService } from './services/device.service';
import { AngularFireModule } from '@angular/fire/compat';
import { CommentService } from './services/domain/comment.service';
import { ReplyService } from './services/domain/reply.service';
import { InAppBrowserService } from './services/in-app-browser.service';
import { PetService } from './services/domain/pet.service';
import { ActivityService } from './services/domain/activity.service';
import { NotificationService } from './services/domain/notification.service';

registerLocaleData(localeEs, 'es');

let resolvePersistenceEnabled: (enabled: boolean) => void;

export const persistenceEnabled = new Promise<boolean>((resolve) => {
  resolvePersistenceEnabled = resolve;
});

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ProfilePageModule,
    IonicModule.forRoot({ mode: 'ios' }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    AngularFireModule.initializeApp(environment.firebase),
    provideAuth(() => {
      if (Capacitor.isNativePlatform()) {
        return initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence,
        });
      } else {
        return getAuth();
      }
    }),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    AngularFireAnalyticsModule,
    TagInputModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es' },
    ScreenTrackingService,
    UserTrackingService,
    AlertService,
    LoadingService,
    NavigationService,
    ReactiveFormsModule,
    LocalStorageService,
    ModalService,
    PhotoService,
    StorageService,
    FirestoreService,
    PublicationService,
    DeviceService,
    CommentService,
    ReplyService,
    InAppBrowserService,
    PetService,
    ActivityService,
    NotificationService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
