import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { v4 as uuid } from 'uuid';
import { AdoptionMetadata, AdoptionStatus, Publication, PublicationType } from 'src/types/publication';
import { GALLERY, SAD } from 'src/utils/assets';
import { AuthService } from 'src/app/services/auth.service';
import { PublicationService } from 'src/app/services/domain/publication.service';
import { AlertService } from 'src/app/services/alert.service';
import { errorWithServices, successAlert } from 'src/utils/alerts';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { PhotoService } from 'src/app/services/avatar.service';
import { AppUser } from 'src/types/app-user';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Pet } from 'src/types/pet';
import { PetService } from 'src/app/services/domain/pet.service';
import { ActivityService } from 'src/app/services/domain/activity.service';
import {
  AppointmentMetadata,
  AppointmentType,
  UserActivity,
  UserActivityStatus,
  UserActivityType,
} from 'src/types/user-activity';
import { ApplicantStatus } from 'src/types/adoption-applicant';

@Component({
  selector: 'app-add-publication',
  templateUrl: './add-publication.page.html',
  styleUrls: ['./add-publication.page.scss'],
})
export class AddPublicationPage implements OnInit {
  working = true;
  error = false;
  sadImage = SAD;
  galleryImage = GALLERY;
  form: FormGroup;
  userId = '';
  newId = uuid();
  newPub: Publication;
  image: Photo;
  uploadedImage = '';
  profile: AppUser | undefined = undefined;
  adoptionInfo: AdoptionMetadata;
  pets: Pet[] = [];
  selectedPet: Pet;
  selectedTags: string[] = [];
  availableTags: string[] = ['Angular', 'React', 'Vue', 'TypeScript', 'JavaScript'];

  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private pub: PublicationService,
    private alertService: AlertService,
    private avatarService: PhotoService,
    private document: FirestoreService,
    private pet: PetService,
    private activity: ActivityService,
  ) {}
  pubTypes = [
    {
      id: PublicationType.IMAGE,
      value: 'Imagen',
    },
    {
      id: PublicationType.ADOPTION,
      value: 'Adopción',
    },
  ];

  async ngOnInit() {
    const user = await this.authService.getAuthState();
    console.log('💡 user::: ', user);
    if (!user) return;
    this.userId = user.uid;
    this.document.getDocument<AppUser>(`users/${this.userId}`).subscribe((data) => {
      console.log('💡 data::: ', data);
      this.profile = data;
    });
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
      type: ['', Validators.required],
      pet: [''],
      bio: ['', [Validators.required, Validators.maxLength(100)]],
      keywords: [[], Validators.required],
    });
    const petControl = this.form.controls['pet'];
    petControl.disable();
    this.form.get('type')?.valueChanges.subscribe((change) => {
      const validators: ValidatorFn[] = [];
      console.log('💡 change::: ', change);
      if (change == PublicationType.ADOPTION) {
        validators.push(Validators.required);
        petControl.enable();
      } else {
        petControl.disable();
      }
      petControl.addValidators(validators);
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  async changePubImage() {
    this.image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      width: 400,
      height: 400,
      source: CameraSource.Prompt,
      promptLabelPhoto: 'Desde Galería',
      promptLabelPicture: 'Tomar foto',
      promptLabelCancel: 'Cancelar',
      promptLabelHeader: 'Selección de foto',
    });
    console.log('💡 this.image::: ', this.image);
    if (this.image) {
      this.uploadedImage = await this.avatarService.setProfileImage(this.newId, 'publication', uuid(), this.image);
      if (!this.uploadedImage) {
        this.alertService.presentToast(errorWithServices);
      }
    }
  }

  async publish() {
    if (this.form.invalid || !this.profile) {
      return;
    }
    const values = this.form.value;
    console.log('💡 values::: ', values);
    this.selectedPet = values.pet;

    const today = +new Date();
    const keywords = values.keywords.map((x: { display: string; value: string }) => x.value);
    console.log('💡 keywords::: ', keywords);
    this.newPub = {
      title: values.name,
      description: values.bio,
      tags: keywords,
      createdAt: today,
      content: {
        text: '',
        images: [this.uploadedImage],
      },
      type: values.type,
      likes: 0,
      verified: false,
      profileId: this.profile.profileId,
      profileImageURL: this.profile.profileImageURL,
      profileName: this.profile.profileName,
    };
    if (values.type == PublicationType.ADOPTION) {
      this.adoptionInfo = {
        location: '',
        lat: 0,
        long: 0,
        age: 0,
        pet: this.selectedPet,
        status: AdoptionStatus.IN_PROGRESS,
        applicants: 0,
        limit: 0,
        endTime: 0,
        finishedAt: 0,
      };
      this.newPub.adoption = this.adoptionInfo;
    }
    this.working = true;
    let ok = await this.pub.add(this.newId, this.newPub);
    if (!ok) {
      this.alertService.presentToast(errorWithServices);
      this.working = false;
      return;
    }

    if (this.newPub.type == PublicationType.ADOPTION) {
      ok = await this.addActivity(this.newId, this.newPub);
      if (!ok) {
        this.alertService.presentToast(errorWithServices);
        this.working = false;
        return;
      }
    }

    this.working = false;
    this.alertService.presentToast(successAlert);
    this.buildForm();
    this.dismiss();
  }

  async addActivity(pubId: string,pub: Publication) {
    if (!pub.adoption?.pet) {
      return false;
    }
    const today = +new Date();
    const pet: Pet = pub.adoption?.pet;
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
      name: 'Adopción',
      description: pub.description,
      createdAt: today,
      type: UserActivityType.ADOPTION,
      status: UserActivityStatus.PENDING,
      appointmentMetadata: appointmentDetails,
      adoptionMetadata: {
        status: ApplicantStatus.PENDING,
        publicationId: pubId,
      }
    };
    console.log('💡 newActivity::: ', newActivity);
    this.working = true;
    const ok = await this.activity.add(this.userId, this.newId, newActivity);
    return ok;
  }
}
