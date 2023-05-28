import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { PawsService } from 'src/app/services/domain/paws.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { Breed } from 'src/types/breed';
import { errorBuildingRecipe } from 'src/utils/alerts';
import { COMPANY_LOGO } from 'src/utils/assets';
import { registerRoute } from '../../../utils/app-routes';
import { homeTexts } from '../../../utils/texts';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  image = COMPANY_LOGO;
  texts = homeTexts;
  breeds: Breed[] = [];
  loading = true;

  constructor(private alertService: AlertService, private navigation: NavigationService, private paws: PawsService) {}

  ngOnInit() {
    this.paws.getBreeds().subscribe(res => {
      console.log('💡 res::: ', res);
      this.breeds = res;
      setTimeout(() => {
        this.loading = false;
      }, 600);
    }, (error) => {
      this.alertService.presentToast(errorBuildingRecipe);
      this.loading = false;
    });
  }

  doRefresh(event: any) {
    console.log('Begin async operation');
    this.ngOnInit();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
}
