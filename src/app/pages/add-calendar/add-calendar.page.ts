import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { v4 as uuid } from 'uuid';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoService } from 'src/app/services/avatar.service';
import { PetService } from 'src/app/services/domain/pet.service';
import { CALENDAR, SAD } from 'src/utils/assets';
import {
  UserActivityType,
  UserActivityStatus,
  AppointmentType,
  activityTypes,
  appointmentTypes,
  UserActivity,
  AppointmentMetadata,
} from 'src/types/user-activity';
import { Pet } from 'src/types/pet';
import { AppUser } from 'src/types/app-user';
import { ActivityService } from 'src/app/services/domain/activity.service';
import { errorWithServices, successAlert } from 'src/utils/alerts';

@Component({
  selector: 'app-add-calendar',
  templateUrl: './add-calendar.page.html',
  styleUrls: ['./add-calendar.page.scss'],
})
export class AddCalendarPage implements OnInit {
  working = true;
  error = false;
  sadImage = SAD;
  calendarImage = CALENDAR;
  form: FormGroup;
  userId = '';
  newId = uuid();
  pets: Pet[] = [];

  activityTypes = activityTypes;
  appointmentTypes = appointmentTypes;

  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private avatarService: PhotoService,
    private pet: PetService,
    private authService: AuthService,
    private alertService: AlertService,
    private activity: ActivityService,
  ) {}

  async ngOnInit() {
    const user = await this.authService.getAuthState();
    console.log('💡 user::: ', user);
    if (!user) return;
    this.userId = user.uid;
    this.pet.loadPetsByOwnerId(user.uid).subscribe((pets) => {
      console.log('💡 pets::: ', pets);
      this.pets = pets;
      this.buildForm();
      this.working = false;
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(100)]],
      date: [new Date().toISOString(), Validators.required],
      pet: ['', Validators.required],
      type: ['', [Validators.required]],
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  async addActivity() {
    if (this.form.invalid) {
      return;
    }

    const values = this.form.value;
    console.log('💡 values::: ', values);
    const today = +new Date();
    const pet: Pet = values.pet;
    const appointmentDetails: AppointmentMetadata = {
      date: new Date(values.date).getTime(),
      type: values.type,
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
      name: values.name,
      description: values.description,
      createdAt: today,
      type: UserActivityType.APPOINTMENT,
      status: UserActivityStatus.PENDING,
      appointmentMetadata: appointmentDetails,
    };
    console.log('💡 newActivity::: ', newActivity);
    this.working = true;
    const ok = await this.activity.add(this.userId, this.newId, newActivity);
    if (!ok) {
      this.alertService.presentToast(errorWithServices);
      this.working = false;
      return;
    }
    this.working = false;
    this.alertService.presentToast(successAlert);
    this.buildForm();
    this.dismiss();
  }
}
