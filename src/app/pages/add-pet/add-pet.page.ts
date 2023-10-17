import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { v4 as uuid } from 'uuid';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoService } from 'src/app/services/avatar.service';
import { PetService } from 'src/app/services/domain/pet.service';
import { Pet, PetGender, PetSpecie } from 'src/types/pet';
import { errorSignIn, errorWithServices, successAlert } from 'src/utils/alerts';
import { PET_PROFILE, SAD } from 'src/utils/assets';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.page.html',
  styleUrls: ['./add-pet.page.scss'],
})
export class AddPetPage implements OnInit {
  working = true;
  error = false;
  sadImage = SAD;
  profileImage = PET_PROFILE;
  form: FormGroup;
  userId = '';
  newId = uuid();
  species = [
    {
      id: PetSpecie.DOG,
      value: 'Perro',
    },
    {
      id: PetSpecie.CAT,
      value: 'Gato',
    },
  ];

  sex = [
    {
      id: PetGender.MALE,
      value: 'Macho',
    },
    {
      id: PetGender.FEMALE,
      value: 'Hembra',
    },
  ];
  newPet: Pet;
  image: Photo;
  uploadedImage = '';

  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private avatarService: PhotoService,
    private pet: PetService,
    private authService: AuthService,
    private alertService: AlertService,
  ) {}

  async ngOnInit() {
    const user = await this.authService.getAuthState();
    console.log('💡 user::: ', user);
    if (!user) return;
    this.userId = user.uid;
    this.buildForm();
    this.working = false;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      sex: ['', Validators.required],
      species: ['', Validators.required],
      bio: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  async changeProfileImage() {
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
      this.uploadedImage = await this.avatarService.setProfileImage(this.newId, 'profile', 'profile', this.image);
      if (!this.uploadedImage) {
        this.alertService.presentToast(errorWithServices);
      }
    }
  }

  async register() {
    if (this.form.invalid) {
      return;
    }
    const values = this.form.value;
    console.log('💡 values::: ', values);
    const today = +new Date();
    this.newPet = {
      breed: '',
      color: '',
      ownerId: this.userId,
      isAdopted: false,
      adoptionDate: 0,
      species: values.species,
      gender: values.sex,
      profileId: values.name + today,
      profileImageURL: this.uploadedImage,
      profileName: values.name,
      createdAt: today,
      bio: values.bio,
    };
    this.working = true;
    const ok = await this.pet.add(this.newId, this.newPet);
    if (!ok) {
      this.alertService.presentToast(errorWithServices);
      return;
    }
    this.working = false;
    this.alertService.presentToast(successAlert);
    this.buildForm();
    this.dismiss();
  }
}
