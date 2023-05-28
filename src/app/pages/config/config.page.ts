import { Component, OnInit } from '@angular/core';

import { AlertService } from '../../services/alert.service';
import { LoadingService } from '../../services/loading.service';
import { NavigationService } from '../../services/navigation.service';

import { COMPANY_LOGO } from '../../../utils/assets';
import { homeRoute, loginRoute } from 'src/utils/app-routes';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  isLoading = true;
  headerInformation = {
    title: 'Configuración',
    subtitle: 'Desde aquí puedes administrar tu cuenta',
    image: '',
  };
  constructor(
    private alert: AlertService,
    private loading: LoadingService,
    private navigation: NavigationService,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    await this.start();
  }

  async start() {
    this.isLoading = true;
    await this.loading.present();
    setTimeout(async () => {
      await this.loading.dismiss();
      this.isLoading = false;
    }, 500);
  }

  signOut() {
    this.authService.logout();
    this.navigation.navigateByUrl(loginRoute);
  }
}
