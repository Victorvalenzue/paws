import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [CommonModule, FormsModule, ComponentsModule, ReactiveFormsModule, IonicModule, SearchPageRoutingModule],
  declarations: [SearchPage],
})
export class SearchPageModule {}
