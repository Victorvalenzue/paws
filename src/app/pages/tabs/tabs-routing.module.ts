import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'app',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'config',
        loadChildren: () => import('../config/config.module').then((m) => m.ConfigPageModule),
      },
      {
        path: 'profile/:id',
        loadChildren: () => import('../profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'add-publication',
        loadChildren: () => import('../add-publication/add-publication.module').then((m) => m.AddPublicationPageModule),
      },
      {
        path: 'pets',
        loadChildren: () => import('../pets/pets.module').then((m) => m.PetsPageModule),
      },
      {
        path: 'add-pet',
        loadChildren: () => import('../add-pet/add-pet.module').then((m) => m.AddPetPageModule),
      },
      {
        path: 'search',
        loadChildren: () => import('../search/search.module').then((m) => m.SearchPageModule),
      },
      {
        path: 'calendar',
        loadChildren: () => import('../calendar/calendar.module').then((m) => m.CalendarPageModule),
      },
      {
        path: 'add-calendar',
        loadChildren: () => import('../add-calendar/add-calendar.module').then((m) => m.AddCalendarPageModule),
      },
      {
        path: 'calendar-detail',
        loadChildren: () => import('../calendar-detail/calendar-detail.module').then((m) => m.CalendarDetailPageModule),
      },
      {
        path: 'notifications',
        loadChildren: () => import('../notifications/notifications.module').then((m) => m.NotificationsPageModule),
      },
      {
        path: 'user-list',
        loadChildren: () => import('../user-list/user-list.module').then((m) => m.UserListPageModule),
      },
      {
        path: '',
        redirectTo: '/app/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/app/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
