import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPublicationPageRoutingModule } from './add-publication-routing.module';

import { AddPublicationPage } from './add-publication.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    IonicModule,
    AddPublicationPageRoutingModule,
    TagInputModule,
  ],
  declarations: [AddPublicationPage],
})
export class AddPublicationPageModule {}
