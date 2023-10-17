import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { register } from 'swiper/element/bundle';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { DeviceService } from './services/device.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private analytics: AngularFireAnalytics, private device: DeviceService) {}

  async ngOnInit()
  {
    const model = await this.device.getDeviceModel()
    console.log('💡 model::: ', model)
    await this.analytics.logEvent('app_open', {"model": model});
  }

  ngAfterViewInit(): void {}
}
