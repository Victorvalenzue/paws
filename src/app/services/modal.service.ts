/* eslint-disable no-underscore-dangle */ //TODO; Quitar esto
import { Injectable } from '@angular/core';
import { ModalController, ModalOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(public _modalController: ModalController) {}

  async presentModal(modalOptions: ModalOptions): Promise<any> {
    const modal = await this._modalController.create(modalOptions);
    await modal.present();
    return modal.onDidDismiss();
  }

  async closeAllModals(): Promise<void> {
    let topModal = await this._modalController.getTop();
    while (topModal) {
      await topModal.dismiss();
      topModal = await this._modalController.getTop();
    }
  }
}
