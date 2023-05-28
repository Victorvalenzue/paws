import { Injectable, OnInit } from '@angular/core';
import { LoadingController, LoadingOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loader: HTMLIonLoadingElement | undefined;
  defaultOptions: LoadingOptions = {
    animated: true,
    spinner: 'circular',
    message: 'Cargando...',
    translucent: true,
    cssClass: 'custom-loading',
  };

  constructor(public loadingController: LoadingController) {}

  async startLoader(options: LoadingOptions) {
    return await this.loadingController.create(options);
  }

  async loaderCtrl(options?: LoadingOptions): Promise<void> {
    const option = options ? options : this.defaultOptions;
    this.loader = await this.startLoader(option);
  }

  async present(options?: LoadingOptions) {
    await this.loaderCtrl(options);
    if (!this.loader) {
      return;
    }
    await this.loader.present();
  }

  async dismiss() {
    if (!this.loader) {
      return;
    }
    await this.loader.dismiss();
  }
}
