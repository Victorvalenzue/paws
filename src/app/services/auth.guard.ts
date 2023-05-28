import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

import { loginRoute } from '../../utils/app-routes';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.auth.getAuthState().subscribe((user) => {
        console.log('hay sesion?', user);
        const isok = !!user;

        if (!isok) {
          this.router.navigate([loginRoute]);
        }

        resolve(isok);
      });
    });
  }
}
