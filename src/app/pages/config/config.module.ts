import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigPageRoutingModule } from './config-routing.module';
import { ComponentsModule } from '../../components/components.module';

import { ConfigPage } from './config.page';

@NgModule({
  imports: [CommonModule, ComponentsModule, FormsModule, IonicModule, ReactiveFormsModule, ConfigPageRoutingModule],
  declarations: [ConfigPage],
})
export class ConfigPageModule {}
