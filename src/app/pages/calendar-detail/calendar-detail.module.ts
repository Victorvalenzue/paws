import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarDetailPageRoutingModule } from './calendar-detail-routing.module';

import { CalendarDetailPage } from './calendar-detail.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    IonicModule,
    CalendarDetailPageRoutingModule,
  ],
  declarations: [CalendarDetailPage],
})
export class CalendarDetailPageModule {}
