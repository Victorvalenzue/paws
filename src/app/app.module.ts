import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AlertService } from './services/alert.service';
import { LoadingService } from './services/loading.service';
import { NavigationService } from './services/navigation.service';
import { StorageService } from './services/storage.service';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { PawsService } from './services/domain/paws.service';
import { HttpClientModule } from '@angular/common/http';

let resolvePersistenceEnabled: (enabled: boolean) => void;

export const persistenceEnabled = new Promise<boolean>((resolve) => {
  resolvePersistenceEnabled = resolve;
});

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot({ mode: 'ios' }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AlertService,
    LoadingService,
    NavigationService,
    ReactiveFormsModule,
    PawsService,
    StorageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
