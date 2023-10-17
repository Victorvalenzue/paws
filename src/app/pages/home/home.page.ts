import { AfterViewInit, Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalOptions } from '@ionic/angular';
import { IonicSlides } from '@ionic/angular';
import { Swiper } from 'swiper';
import { v4 as uuid } from 'uuid';

import { AlertService } from 'src/app/services/alert.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { EstandardContent } from 'src/types/content';

import { EMPTY_DISH, COMPANY_LOGO, PAW_LOCATION } from 'src/utils/assets';

import { homeTexts } from '../../../utils/texts';
import { ProfilePage } from '../profile/profile.page';
import { ModalService } from 'src/app/services/modal.service';
import { DocumentData, Firestore, where } from '@angular/fire/firestore';
import { PhotoService } from 'src/app/services/avatar.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StorageRequest } from 'src/app/services/storage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AppUser } from 'src/types/app-user';
import { PublicationService } from 'src/app/services/domain/publication.service';
import { CommentService } from 'src/app/services/domain/comment.service';
import { ReplyService } from 'src/app/services/domain/reply.service';
import { InAppBrowserService } from 'src/app/services/in-app-browser.service';
import { OpenOptions } from '@capacitor/browser';
import { getPublications } from 'src/faker/faker';
import { AdoptionStatus, Publication } from 'src/types/publication';
import {
  AppointmentMetadata,
  AppointmentType,
  UserActivity,
  UserActivityStatus,
  UserActivityType,
  appointmentStatus,
  appointmentTypes,
} from 'src/types/user-activity';
import { addPublicationRoute, calendarRoute } from 'src/utils/app-routes';
import { AddPublicationPage } from '../add-publication/add-publication.page';
import { AdoptionApplicant, ApplicantStatus } from 'src/types/adoption-applicant';
import { errorToast, errorWithServices, successAlert } from 'src/utils/alerts';
import { ActivityService } from 'src/app/services/domain/activity.service';
import { CalendarDetailPage } from '../calendar-detail/calendar-detail.page';
import { Pet } from 'src/types/pet';
import { NotificationsPage } from '../notifications/notifications.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  swiperModules = [IonicSlides];
  profile: AppUser | undefined = undefined;
  image = COMPANY_LOGO;
  texts = homeTexts;
  headerInformation = {
    title: 'Paws',
    image: COMPANY_LOGO,
    subtitle: '',
  };
  offers: EstandardContent[] = [
    {
      name: 'premiumfood',
      image: 'https://loremflickr.com/200/180/pet?lock=2762672189734912',
      description: 'Excelentes ofertas cerca de ti',
      button: 'Ver tiendas',
      link: 'https://www.base64decode.org/',
    },
    {
      name: 'perritoffers',
      image: 'https://loremflickr.com/200/180/pet?lock=5873783801905152',
      description: 'Tenemos el mejor plan para tu mascota. La salud no tiene precio',
      button: 'Contáctanos',
      link: '',
    },
    {
      name: 'accesorios',
      image: 'https://loremflickr.com/200/180/pet?lock=6378551601266688',
      description: 'Camas, ropa, juguetes y todo lo que se te ocurra!',
      button: 'Comprar',
      link: '',
    },
    {
      name: 'gaties',
      image: 'https://loremflickr.com/200/180/pet?lock=7301172064944128',
      description: 'Camas, ropa, juguetes y todo lo que se te ocurra!',
      button: 'Más información',
      link: '',
    },
  ];
  loading = true;
  pubs: Publication[] = [];
  noPubsInfo = {
    image: EMPTY_DISH,
    title: 'Estas al día',
    subtitle: 'Comienza a seguir a otros para recibir más contenido',
  };
  activities: UserActivity[] = [];
  noActivitiesInfo = {
    image: PAW_LOCATION,
    title: 'No tienes actividades',
    subtitle: '',
    link: calendarRoute,
    linkText: 'Crear',
  };
  endReached = false;
  userId = '';

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

  ngAfterViewInit(): void {}

  async ngOnInit() {
    this.loading = true;
    this.pubs = [];
    await this.dataExample();
  }

  doRefresh(event: any) {
    console.log('Begin async operation');
    this.ngOnInit();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async dataExample() {
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
      if (this.profile.tags.length > 0) {
        this.publications.loadPublicationsByUserTags(this.profile.tags).subscribe((pubs) => {
          console.log('💡 pubs::: ', pubs);
          this.pubs = pubs;
          this.loading = false;
        });
      }
      // I49tDYCJH6rVXadfL9xr
      this.comments.loadCommentsByPublicationId('I49tDYCJH6rVXadfL9xr').subscribe((comments) => {
        console.log('💡 comments::: ', comments);
      });
      // IeSM4PVQKGBXCqOZalcg
      this.replies.loadRepliesByCommentId('I49tDYCJH6rVXadfL9xr', 'IeSM4PVQKGBXCqOZalcg').subscribe((replies) => {
        console.log('💡 replies::: ', replies);
      });
      this.loadActivities();
    });
  }

  loadActivities() {
    this.activity.loadByUserId(this.userId).subscribe((activities) => {
      console.log('💡 activities::: ', activities);
      this.activities = activities;
      this.loading = false;
    });
  }

  async handleProfileModal() {
    const modalOptions: ModalOptions = {
      component: ProfilePage,
      cssClass: '',
    };
    return this.modalService.presentModal(modalOptions);
  }

  async openLink(url: string) {
    const options: OpenOptions = {
      url,
      presentationStyle: 'popover',
    };
    await this.inAppBrowser.openWithInAppBrowser(options);
  }

  liked(pubId?: string) {
    if (!pubId) {
      return;
    }
    if (!this.profile) {
      return;
    }
    if (!this.profile?.likes) {
      return false;
    }
    return this.profile.likes.includes(pubId);
  }

  setLike(pubId?: string) {
    if (!pubId) {
      return;
    }
    if (!this.profile) {
      return;
    }
    if (!this.profile?.likes) {
      this.profile.likes = [pubId];
      return;
    }
    if (this.liked(pubId)) {
      this.profile.likes = this.profile.likes.filter((x) => x !== pubId);
      return;
    }
    this.profile?.likes.push(pubId);
  }

  async addPublication() {
    //this.navigation.navigateByUrl(addPublicationRoute)
    const modalOptions: ModalOptions = {
      component: AddPublicationPage,
      cssClass: '',
    };
    await this.modalService.presentModal(modalOptions);
    this.ngOnInit();
  }

  async activityDetail(activity: UserActivity) {
    const modalOptions: ModalOptions = {
      component: CalendarDetailPage,
      componentProps: { activity },
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8, 1],
      cssClass: '',
    };
    await this.modalService.presentModal(modalOptions);
    this.loadActivities();
  }

  scrollHandler(event: any) {
    this.endReached = false;
    if (!event) {
      return;
    }
    const currentLength = this.pubs.length;

    console.log('end reached');
    if (!this.profile) {
      return;
    }
    console.log('💡 this.profile.tags::: ', this.profile.tags);
    this.publications.loadMorePublicationsByUserTags(this.profile.tags).subscribe(
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
    this.loadActivities();
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

  getTags(tags: string[]) {
    return tags.join(', ');
  }

  getImage(type: AppointmentType) {
    const types = appointmentTypes;
    return types.find((x) => x.id === type)?.image;
  }

  getStatus(type: UserActivityStatus) {
    const status = appointmentStatus;
    return status.find((x) => x.id === type);
  }

  openNotifications() {
    const modalOptions: ModalOptions = {
      component: NotificationsPage,
      cssClass: '',
    };
    return this.modalService.presentModal(modalOptions);
  }
}
