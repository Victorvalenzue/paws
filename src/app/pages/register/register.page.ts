import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { COMPANY_LOGO } from 'src/utils/assets';
import { emailAlreadyInUse, errorRegister, successRegister } from '../../../utils/alerts';
import { landingRoute, loginRoute } from '../../../utils/app-routes';

import { registerTexts } from '../../../utils/texts';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  form!: FormGroup;
  texts = registerTexts;
  image = COMPANY_LOGO;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private navigation: NavigationService,
    private loading: LoadingService,
  ) {
    this.buildForm();
  }

  ngOnInit() {}

  gotoLandingPage() {
    this.navigation.navigateByUrl(landingRoute);
  }

  gotoLoginPage() {
    this.navigation.navigateByUrl(loginRoute);
  }

  async register() {
    const value = {
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password,
    };
    await this.loading.present();
    const user = await this.authService.register(value);
    console.log(user);
    this.buildForm();
    await this.loading.dismiss();
    this.gotoLoginPage();
  }

  private buildForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });
  }
}
