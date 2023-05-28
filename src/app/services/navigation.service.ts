import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  data: any;

  constructor(private router: Router) {}

  navigateWithData(route: string, dataTransfer: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        data: dataTransfer,
      },
    };

    this.router.navigate([route], navigationExtras);
  }

  navigateByUrl(url: string) {
    this.router
      .navigateByUrl(url)
      .then((response) => {})
      .catch((error) => {});
  }
}
