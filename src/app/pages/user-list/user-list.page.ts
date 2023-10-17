import { Component, Input, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { v4 as uuid } from 'uuid';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/domain/notification.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalService } from 'src/app/services/modal.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { AdoptionApplicant } from 'src/types/adoption-applicant';
import { AppUser } from 'src/types/app-user';
import { AppNotification } from 'src/types/notification';
import { PROFILE, SAD } from 'src/utils/assets';
import { AlertService } from 'src/app/services/alert.service';
import { errorWithServices, successAlert } from 'src/utils/alerts';
import { AdoptionStatus, Publication } from 'src/types/publication';
import { UserActivity, UserActivityStatus } from 'src/types/user-activity';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  @Input()
  pubId: string;

  @Input() activity: UserActivity;

  working = true;
  error = false;
  endReached = false;
  sadImage = SAD;
  defaultProfile = PROFILE;
  headerInformation = {
    title: 'Notificaciones',
    image: '',
    subtitle: '',
  };
  noInfo = {
    image: PROFILE,
    title: 'No hay postulantes',
    subtitle: 'Espera a que aparezcan interesados',
    link: '',
    linkText: '',
    action: false,
  };
  userId = '';
  users: AdoptionApplicant[] = [];
  profile: AppUser | undefined = undefined;

  constructor(
    private modalService: ModalService,
    private authService: AuthService,
    public modalController: ModalController,
    private navigation: NavigationService,
    private firebase: FirestoreService,
    private loading: LoadingService,
    private notification: NotificationService,
    private alertService: AlertService,
  ) {}

  async ngOnInit() {
    this.working = true;
    this.users = [];
    const user = await this.authService.getAuthState();
    console.log('💡 user::: ', user);
    if (!user) return;

    this.userId = user.uid;
    this.firebase.getDocument<AppUser>(`users/${user.uid}`).subscribe((data) => {
      console.log('💡 data::: ', data);
      if (!data) {
        console.log('💡 no hay data de usuario::: ');
      }
      this.profile = data;
      this.firebase
        .getCollection<AdoptionApplicant>(`publications/${this.pubId}/applicants`)
        .subscribe((applicants) => {
          console.log('💡 applicants::: ', applicants);
          this.users = applicants;
          setTimeout(() => {
            this.working = false;
          }, 1000);
        });
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  async doRefresh(event: any) {
    console.log('Begin async operation');
    await this.ngOnInit();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async goto(route: string) {
    this.navigation.navigateByUrl(route);
  }

  async select(user: AdoptionApplicant) {
    console.log('💡 user::: ', user);
    if (!this.profile || !user.idField) {
      return;
    }
    await this.loading.present();
    const notification: AppNotification = {
      content: `${this.profile.profileName} te ha seleccionado para adoptar`,
      route: '',
      profileId: this.profile?.profileId,
      profileImageURL: this.profile.profileImageURL,
      profileName: this.profile.profileName,
      createdAt: +new Date(),
    };

    const publication = await this.firebase.getDocumentPromise<Publication>(`publications/${this.pubId}`);
    if (!publication) {
      this.alertService.presentToast(errorWithServices);
      await this.loading.dismiss();
      return;
    }

    if (!publication.adoption) {
      return;
    }

    publication.adoption.status = AdoptionStatus.ADOPTED;
    await this.firebase.updateDocument({
      path: `publications/${this.pubId}`,
      body: publication,
    });
    this.activity.status = UserActivityStatus.COMPLETED;
    await this.firebase.updateDocument({
      path: `users/${this.userId}/activities/${this.activity.idField}`,
      body: this.activity,
    });

    let ok = await this.notification.add(user.idField, uuid(), notification);
    if (!ok) {
      this.alertService.presentToast(errorWithServices);
      await this.loading.dismiss();
      return;
    }

    await this.loading.dismiss();
    this.alertService.presentToast(successAlert);
    this.modalController.dismiss();
  }
}
