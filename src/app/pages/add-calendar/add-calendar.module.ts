import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCalendarPageRoutingModule } from './add-calendar-routing.module';

import { AddCalendarPage } from './add-calendar.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ReactiveFormsModule,
    AddCalendarPageRoutingModule,
  ],
  declarations: [AddCalendarPage],
})
export class AddCalendarPageModule {}
