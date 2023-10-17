/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Device, DeviceId, DeviceInfo } from '@capacitor/device';


@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  async deviceId(): Promise<DeviceId> {
    return await Device.getId();
  }

  async getDeviceInformation(): Promise<DeviceInfo> {
    return await Device.getInfo();
  }

  async getDeviceModel(): Promise<string> {
    const info = await this.getDeviceInformation();
    return info.model;
  }
}
