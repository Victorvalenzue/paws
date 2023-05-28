import { Injectable } from '@angular/core';
import { ToastController, AlertController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private toastController: ToastController, public alertController: AlertController) {}

  async presentBasicToast(message: string, color: string, duration = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top',
      color,
    });

    await toast.present();
  }

  async presentToast(toastOptions: ToastOptions) {
    const toast = await this.toastController.create(toastOptions);

    await toast.present();
  }
}
