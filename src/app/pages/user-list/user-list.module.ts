import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserListPageRoutingModule } from './user-list-routing.module';

import { UserListPage } from './user-list.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [CommonModule, FormsModule, ComponentsModule, ReactiveFormsModule, IonicModule, UserListPageRoutingModule],
  declarations: [UserListPage],
})
export class UserListPageModule {}
