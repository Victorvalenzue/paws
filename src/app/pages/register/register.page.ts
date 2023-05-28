import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { COMPANY_LOGO } from 'src/utils/assets';
import { emailAlreadyInUse, errorRegister, successRegister } from '../../../utils/alerts';
import { landingRoute, loginRoute } from '../../../utils/app-routes';

import { registerTexts } from '../../../utils/texts';

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

  register() {
    const value = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.authService.signUp(value.email, value.password).subscribe(res => {
      console.log('💡 res::: ', res);
      this.buildForm();
      this.gotoLoginPage();
    }, (error) => {
      this.alertService.presentToast(errorRegister);
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });
  }
}
