import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NavigationService } from './navigation.service';
import { loginRoute } from 'src/utils/app-routes';
import { AlertService } from './alert.service';
import { errorRegister, errorSignIn, successRegister } from 'src/utils/alerts';
import { HttpClient } from '@angular/common/http';
import { Register } from 'src/types/register';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private alertService: AlertService,
    private http: HttpClient,
    private navigation: NavigationService,
  ) {
  }
  /* Sign up */
  signUp(email: string, password: string) {
    return this.http.post<Register>(environment.apiURL + 'register', {email, password})
  }
  /* Sign in */
  signIn(email: string, password: string) {
    return this.http.post<string>(environment.apiURL + 'login', {email, password})
  }

  /* Sign out */
  logout() {

  }

  resetPassword(email: string) {
  }

  getAuthState() {
    return of(true);
  }

  getCurrentUser() {
  }
}
