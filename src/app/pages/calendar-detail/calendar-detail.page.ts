import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, ModalOptions } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoService } from 'src/app/services/avatar.service';
import { ActivityService } from 'src/app/services/domain/activity.service';
import { PetService } from 'src/app/services/domain/pet.service';
import { ApplicantStatus } from 'src/types/adoption-applicant';
import {
  AppointmentType,
  UserActivity,
  UserActivityStatus,
  UserActivityType,
  appointmentStatus,
  appointmentTypes,
} from 'src/types/user-activity';
import { errorWithServices, successAlert } from 'src/utils/alerts';
import { CALENDAR, SAD } from 'src/utils/assets';
import { UserListPage } from '../user-list/user-list.page';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-detail.page.html',
  styleUrls: ['./calendar-detail.page.scss'],
})
export class CalendarDetailPage implements OnInit {
  working = true;
  error = false;
  sadImage = SAD;
  calendarImage = CALENDAR;
  form: FormGroup;
  userId = '';
  statuses = UserActivityStatus;
  types = UserActivityType;

  @Input() activity: UserActivity;

  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private avatarService: PhotoService,
    private pet: PetService,
    private authService: AuthService,
    private alertService: AlertService,
    private activityService: ActivityService,
    private modalService: ModalService,
  ) {}

  async ngOnInit() {
    const user = await this.authService.getAuthState();
    console.log('💡 user::: ', user);
    if (!user) return;
    this.userId = user.uid;
    setTimeout(() => {
      this.working = false;
    }, 1000);
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  getImage(type: AppointmentType) {
    const types = appointmentTypes;
    return types.find((x) => x.id === type)?.image;
  }

  getStatus(type: UserActivityStatus) {
    const status = appointmentStatus;
    return status.find((x) => x.id === type);
  }

  async changeStatus(status: UserActivityStatus) {
    if (!this.activity.idField) {
      return;
    }
    this.activity.status = status;
    this.working = true;
    const ok = await this.activityService.update(this.userId, this.activity.idField, this.activity);
    if (!ok) {
      this.alertService.presentToast(errorWithServices);
      this.working = false;
      return;
    }
    this.working = false;
    this.alertService.presentToast(successAlert);
  }

  async openUsers(pubId: string) {
    const modalOptions: ModalOptions = {
      component: UserListPage,
      componentProps: { pubId, activity: this.activity },
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8, 1],
      cssClass: '',
    };
    await this.modalService.presentModal(modalOptions);
    this.ngOnInit();
  }
}
