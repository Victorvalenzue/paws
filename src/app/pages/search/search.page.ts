import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { v4 as uuid } from 'uuid';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoService } from 'src/app/services/avatar.service';
import { ActivityService } from 'src/app/services/domain/activity.service';
import { CommentService } from 'src/app/services/domain/comment.service';
import { PublicationService } from 'src/app/services/domain/publication.service';
import { ReplyService } from 'src/app/services/domain/reply.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { InAppBrowserService } from 'src/app/services/in-app-browser.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalService } from 'src/app/services/modal.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { AppUser } from 'src/types/app-user';
import { Publication } from 'src/types/publication';
import {
  AppointmentMetadata,
  AppointmentType,
  UserActivity,
  UserActivityStatus,
  UserActivityType,
} from 'src/types/user-activity';
import { errorToast, errorWithServices, successAlert } from 'src/utils/alerts';
import { AdoptionApplicant, ApplicantStatus } from 'src/types/adoption-applicant';
import { Pet } from 'src/types/pet';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  searching = false;
  working = false;
  searchTerm = '';
  endReached = false;
  userId = '';
  profile: AppUser | undefined = undefined;
  pubs: Publication[] = [];

  headerInformation = {
    title: 'Búsqueda',
    image: '',
    subtitle: '',
  };

  constructor(
    private alertService: AlertService,
    private navigation: NavigationService,
    private modalService: ModalService,
    private avatarService: PhotoService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private document: FirestoreService,
    private publications: PublicationService,
    private comments: CommentService,
    private replies: ReplyService,
    private inAppBrowser: InAppBrowserService,
    private activity: ActivityService,
  ) {}

  async ngOnInit() {
    this.working = true;
    const user = await this.authService.getAuthState();
    console.log('💡 user::: ', user);
    if (!user) return;
    this.userId = user.uid;
    this.document.getDocument<AppUser>(`users/${user.uid}`).subscribe((data) => {
      console.log('💡 data::: ', data);
      if (!data) {
        console.log('💡 no hay data de usuario::: ');
      }
      this.profile = data;
      this.working = false;
    });
    this.pubs = [];
  }

  async dataExample() {
    this.working = true;
    this.publications.loadPublicationsByUserTags([this.searchTerm]).subscribe((pubs) => {
      console.log('💡 pubs::: ', pubs);
      this.pubs = pubs;
      this.working = false;
    });
  }

  async onFilter(event: string) {
    this.searchTerm = event;
    await this.dataExample();
  }

  onBlur() {
    this.searching = false;
  }

  onFocus() {
    this.searching = true;
  }

  scrollHandler(event: any) {
    this.endReached = false;
    if (!event) {
      return;
    }
    const currentLength = this.pubs.length;

    console.log('end reached');
    this.publications.loadMorePublicationsByUserTags([this.searchTerm]).subscribe(
      (pubs) => {
        console.log('💡 new pubs::: ', pubs);
        this.pubs = [...this.pubs, ...pubs];
        if (this.pubs.length === currentLength) {
          this.endReached = true;
        }
      },
      () => {},
      () => {
        (event as InfiniteScrollCustomEvent).target.complete();
      },
    );
  }

  getTags(tags: string[]) {
    return tags.join(', ');
  }

  async tryToAdopt(publication: Publication) {
    console.log('💡 pubId::: ', publication.idField);
    console.log('💡 this.profile::: ', this.profile);
    if (!this.profile) {
      return;
    }

    if (!this.profile.idField || !publication.idField) {
      return;
    }
    await this.loadingService.present();
    const existing = await this.publications.getAdoptionApplicantPromise(publication.idField, this.profile.idField);
    console.log('💡 existing::: ', existing);
    if (existing) {
      this.alertService.presentToast(errorToast('Ya has postulado a la adopción'));
      await this.loadingService.dismiss();
      return;
    }
    const applicant: AdoptionApplicant = {
      status: ApplicantStatus.PENDING,
      profileId: this.profile.profileId,
      profileImageURL: this.profile.profileImageURL,
      profileName: this.profile.profileName,
      createdAt: +new Date(),
    };

    let ok = await this.publications.addAdoptionApplicant(publication.idField, this.profile.idField, applicant);
    ok = await this.addActivity(publication);
    if (!ok) {
      this.alertService.presentToast(errorWithServices);
      await this.loadingService.dismiss();
      return;
    }
    await this.loadingService.dismiss();
    this.alertService.presentToast(successAlert);
  }

  async addActivity(publication: Publication) {
    if (!this.profile) {
      return false;
    }

    if (!this.profile.idField || !publication.idField) {
      return false;
    }

    if (!publication.adoption?.pet) {
      return false;
    }
    const today = +new Date();
    const pet: Pet = publication.adoption.pet;
    const appointmentDetails: AppointmentMetadata = {
      date: today,
      type: AppointmentType.ADOPTION,
      location: '',
      lat: 0,
      long: 0,
      comments: '',
      profileId: pet.profileId,
      profileImageURL: pet.profileImageURL,
      profileName: pet.profileName,
      createdAt: today,
    };
    const newActivity: UserActivity = {
      name: 'Solicitud de adopción',
      description: 'Cuando el proceso termine, recibirás una notificación',
      createdAt: today,
      type: UserActivityType.ADOPTION,
      status: UserActivityStatus.PENDING,
      appointmentMetadata: appointmentDetails,
    };
    console.log('💡 newActivity::: ', newActivity);
    const ok = await this.activity.add(this.userId, uuid(), newActivity);
    return ok;
  }
}
