import { Component, OnInit } from '@angular/core';
import { ModalOptions } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ActivityService } from 'src/app/services/domain/activity.service';
import { ModalService } from 'src/app/services/modal.service';
import { AppointmentType, UserActivity, UserActivityStatus, appointmentStatus, appointmentTypes } from 'src/types/user-activity';
import { CALENDAR, PET_PROFILE } from 'src/utils/assets';
import { AddCalendarPage } from '../add-calendar/add-calendar.page';
import { ApplicantStatus } from 'src/types/adoption-applicant';
import { CalendarDetailPage } from '../calendar-detail/calendar-detail.page';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  loading = true;
  headerInformation = {
    title: 'Actividades',
    image: '',
    subtitle: '',
  };
  noInfo = {
    image: CALENDAR,
    title: 'No tienes actividades',
    subtitle: 'Puedes comenzar creando una para tu mascota',
    link: '',
    linkText: 'Nueva actividad',
    action: true,
  };
  defaultProfile = PET_PROFILE;
  activities: UserActivity[] = [];

  constructor(
    private activity: ActivityService,
    private modalService: ModalService,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.activities = [];
    // this.pubs = getPublications();
    const user = await this.authService.getAuthState();
    console.log('💡 user::: ', user);
    if (!user) return;

    this.activity.loadByUserId(user.uid).subscribe((activities) => {
      console.log('💡 activities::: ', activities);
      this.activities = activities;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
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

  async addActivity() {
    //this.navigation.navigateByUrl(addPublicationRoute)
    const modalOptions: ModalOptions = {
      component: AddCalendarPage,
      cssClass: '',
    };
    const modalSub = await this.modalService.presentModal(modalOptions);
    console.log('💡 modalSub::: ', modalSub);
    this.ngOnInit();
  }

  getImage(type: AppointmentType) {
    const types = appointmentTypes;
    return types.find((x) => x.id === type)?.image;
  }

  getStatus(type: UserActivityStatus) {
    const status = appointmentStatus;
    return status.find((x) => x.id === type);
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
    this.ngOnInit();
  }
}
