import { Component, OnInit } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';

import { NavigationService } from '../../services/navigation.service';

import { landingRoute } from '../../../utils/app-routes';
import { COMPANY_LOGO, SAD } from '../../../utils/assets';
import { SHORT_LOADER } from '../../../utils/constants';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
})
export class NotFoundPage implements OnInit, ViewDidEnter {
  loaded = false;
  logo = SAD;
  headerInformation = {
    title: '',
    image: COMPANY_LOGO,
    subtitle: '',
  };

  constructor(private navigation: NavigationService) {}

  ngOnInit() {}

  ionViewDidEnter(): void {
    setTimeout(() => {
      this.loaded = true;
    }, SHORT_LOADER);
  }

  gotoHome() {
    this.navigation.navigateByUrl(landingRoute);
  }
}
