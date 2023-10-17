import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActionFooterComponent } from './action-footer/action-footer.component';
import { CardComponent } from './card/card.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { MenuButtonComponent } from './menu-button/menu-button.component';
import { NoContentComponent } from './no-content/no-content.component';
import { SkeletonCardsComponent } from './skeleton-cards/skeleton-cards.component';
import { TabCardComponent } from './tab-card/tab-card.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { BrowserModule } from '@angular/platform-browser';
import { PageTemplateComponent } from './page-template/page-template.component';
import { ThumbnailProfileComponent } from './thumbnail-profile/thumbnail-profile.component';
import { HorizontalScrollingComponent } from './horizontal-scrolling/ horizontal-scrolling.component';
import { ImageWithExtraComponent } from './image-with-extra/image-with-extra.component';
import { ExpandableComponent } from './expandable/expandable.component';
import { SearchbarComponent } from './searchbar/searchbar.component';

@NgModule({
  declarations: [
    ActionFooterComponent,
    CardComponent,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    MenuButtonComponent,
    NoContentComponent,
    PageTemplateComponent,
    SkeletonCardsComponent,
    TabCardComponent,
    UploadFileComponent,
    ThumbnailProfileComponent,
    HorizontalScrollingComponent,
    ImageWithExtraComponent,
    ExpandableComponent,
    SearchbarComponent,
  ],
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
  exports: [
    ActionFooterComponent,
    CardComponent,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    MenuButtonComponent,
    NoContentComponent,
    PageTemplateComponent,
    SkeletonCardsComponent,
    TabCardComponent,
    UploadFileComponent,
    ThumbnailProfileComponent,
    HorizontalScrollingComponent,
    ImageWithExtraComponent,
    ExpandableComponent,
    SearchbarComponent,
  ],
})
export class ComponentsModule {}
