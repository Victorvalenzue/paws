/* eslint-disable no-underscore-dangle */

import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Browser, OpenOptions } from '@capacitor/browser';

export const IN_APP_BROWSER_OPTIONS = {
  location: 'no', //Or 'no'
  hidden: 'no', //Or  'yes'
  clearcache: 'yes',
  clearsessioncache: 'yes',
  zoom: 'yes', //Android only ,shows browser zoom controls
  hardwareback: 'yes',
  mediaPlaybackRequiresUserAction: 'no',
  shouldPauseOnSuspend: 'no', //Android only
  closebuttoncaption: 'Cerrar', //iOS only
  disallowoverscroll: 'no', //iOS only
  toolbar: 'yes', //iOS only
  enableViewportScale: 'no', //iOS only
  allowInlineMediaPlayback: 'no', //iOS only
  presentationstyle: 'fullscreen', //iOS only
  fullscreen: 'yes', //Windows only
};

@Injectable({
  providedIn: 'root',
})
export class InAppBrowserService {
  constructor(private plt: Platform) {}

  async openWithInAppBrowser(options: OpenOptions) {
    const android = this.plt.is('android');
    await Browser.open(options);
  }
}
