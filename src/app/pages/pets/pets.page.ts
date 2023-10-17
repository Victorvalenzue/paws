import { Component, OnInit } from '@angular/core';
import { Pet, PetGender } from 'src/types/pet';
import { DOG_HOUSE, PET_PROFILE } from 'src/utils/assets';
import { AddPetPage } from '../add-pet/add-pet.page';
import { ModalOptions } from '@ionic/angular';
import { ModalService } from 'src/app/services/modal.service';
import { PetService } from 'src/app/services/domain/pet.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.page.html',
  styleUrls: ['./pets.page.scss'],
})
export class PetsPage implements OnInit {
  loading = true;
  pets: Pet[] = [];
  profileImage = PET_PROFILE;
  noPetsInfo = {
    image: DOG_HOUSE,
    title: 'No tienes mascotas',
    subtitle: 'Puedes comenzar registrando tus mascotas o buscar en adopción',
    link: '',
    linkText: 'Registrar',
    action: true,
  };
  headerInformation = {
    title: 'Mascotas',
    image: '',
    subtitle: '',
  };

  constructor(
    private modalService: ModalService,
    private pet: PetService,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.pets = [];
    // this.pubs = getPublications();
    const user = await this.authService.getAuthState();
    console.log('💡 user::: ', user);
    if (!user) return;

    this.pet.loadPetsByOwnerId(user.uid).subscribe((pets) => {
      console.log('💡 pets::: ', pets);
      this.pets = pets;
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

  async addPet() {
    //this.navigation.navigateByUrl(addPublicationRoute)
    const modalOptions: ModalOptions = {
      component: AddPetPage,
      cssClass: '',
    };
    const modalSub = await this.modalService.presentModal(modalOptions);
    console.log('💡 modalSub::: ', modalSub);
    this.ngOnInit();
  }

  gender(gender: PetGender) {
    switch (gender) {
      case PetGender.MALE:
        return 'Macho';
      case PetGender.FEMALE:
        return 'Hembra';
      default:
        return '';
    }
  }
}
