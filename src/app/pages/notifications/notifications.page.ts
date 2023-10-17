import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/domain/notification.service';
import { ModalService } from 'src/app/services/modal.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { AppNotification } from 'src/types/notification';
import { NOTIFICATION, PROFILE, SAD } from 'src/utils/assets';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  working = true;
  error = false;
  endReached = false;
  sadImage = SAD;
  defaultProfile = PROFILE;
  headerInformation = {
    title: 'Notificaciones',
    image: '',
    subtitle: '',
  };
  noInfo = {
    image: NOTIFICATION,
    title: 'Estas al día',
    subtitle: 'No tienes nuevas notificaciones',
    link: '',
    linkText: '',
    action: false,
  };
  userId = '';
  notifications: AppNotification[] = [];

  constructor(
    private notification: NotificationService,
    private modalService: ModalService,
    private authService: AuthService,
    public modalController: ModalController,
    private navigation: NavigationService,
  ) {}

  async ngOnInit() {
    this.working = true;
    this.notifications = [];
    // this.pubs = getPublications();
    const user = await this.authService.getAuthState();
    console.log('💡 user::: ', user);
    if (!user) return;

    this.notification.loadByUserId(user.uid).subscribe((notifications) => {
      console.log('💡 notifications::: ', notifications);
      this.notifications = notifications;
      setTimeout(() => {
        this.working = false;
      }, 1000);
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
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

  scrollHandler(event: any) {
    this.endReached = false;
    if (!event) {
      return;
    }
    const currentLength = this.notifications.length;

    console.log('end reached');
    this.notification.loadMoreByUserId(this.userId).subscribe(
      (notifications) => {
        console.log('💡 new notifications::: ', notifications);
        this.notifications = [...this.notifications, ...notifications];
        if (this.notifications.length === currentLength) {
          this.endReached = true;
        }
      },
      () => {},
      () => {
        (event as InfiniteScrollCustomEvent).target.complete();
      },
    );
  }

  async goto(route: string) {
    this.navigation.navigateByUrl(route);
  }
}
