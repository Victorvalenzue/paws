import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { COMPANY_LOGO } from 'src/utils/assets';

import { errorSignIn } from '../../../utils/alerts';
import { homeRoute, registerRoute } from '../../../utils/app-routes';
import { loginTexts } from '../../../utils/texts';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  image = COMPANY_LOGO;
  form: FormGroup | undefined;
  texts = loginTexts;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private navigation: NavigationService,
  ) {
    this.buildForm();
  }

  ngOnInit() {}

  gotoHomePage() {
    this.navigation.navigateByUrl(homeRoute);
  }

  gotoRegisterPage() {
    this.navigation.navigateByUrl(registerRoute);
  }

  buildForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });
  }

  async signIn() {
    if (!this.form) {
      return;
    }
    const value = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.authService.signIn(value.email, value.password).subscribe(res => {
      console.log('💡 res::: ', res)
      this.buildForm();
      this.gotoHomePage();
    }, (error) => {
      this.alertService.presentToast(errorSignIn);
    });
  }
}
