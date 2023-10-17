/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { Clipboard } = Plugins;

import { environment } from 'src/environments/environment';
import { PROFILE, SAD } from 'src/utils/assets';
import { PhotoService } from 'src/app/services/avatar.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AppUser } from 'src/types/app-user';
import { ActivatedRoute } from '@angular/router';
import { CameraSource } from '@capacitor/camera';
import { NavigationService } from 'src/app/services/navigation.service';
import { loginRoute } from 'src/utils/app-routes';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  defaultImage = PROFILE;
  sadImage = SAD;
  working = true;
  profile: AppUser | undefined = undefined;
  fromParam = false;
  form: FormGroup;

  constructor(
    public _modalController: ModalController,
    private avatarService: PhotoService,
    private authService: AuthService,
    private document: FirestoreService,
    private route: ActivatedRoute,
    private navigation: NavigationService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      keywords: [[]],
    });
    this.route.params.subscribe((params) => {
      const id = params['id']; // (+) converts string 'id' to a number
      console.log('💡 params id::: ', id);
      if (id) {
        this.fromParam = true;
      }
      this.preparing(id);
    });
  }

  async preparing(paramId: string) {
    // this.working = true;
    // setTimeout(() => {
    //   this.working = false;
    // }, 1000);
    const user = await this.authService.getAuthState();
    if (!user) return;

    const id = paramId ? paramId : user.uid;
    this.document.getDocument<AppUser>(`users/${id}`).subscribe((data) => {
      console.log('💡 data::: ', data);
      this.profile = data;

      this.form.get('keywords')?.valueChanges.subscribe((keys) => {
        const tags = keys.map((x: { display: string; value: string }) => x.value);
        console.log('💡 this.profile?.tags::: ', this.profile?.tags);
        console.log('💡 tags::: ', tags);
        if (this.profile?.tags.length === tags.length) {
          return;
        }
        console.log('going to update tags');
        this.document.updateDocument({
          path: `users/${this.profile?.idField}`,
          body: {
            tags,
          },
        });
      });

      this.form.patchValue({
        keywords: this.profile?.tags.map((x) => ({
          display: x,
          value: x,
        })),
      });
      this.working = false;
    });
  }

  dismiss() {
    this._modalController.dismiss({
      dismissed: true,
    });
  }

  doRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
      this.ngOnInit();
    }, 3000);
  }

  async changeProfileImage(id: string) {
    await this.avatarService.changeProfileImage(id, 'users', CameraSource.Camera);
  }

  logout() {
    this._modalController.dismiss();
    this.authService.logout();
    this.navigation.navigateByUrl(loginRoute);
  }
}
