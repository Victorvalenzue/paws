import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { menuIcon } from '../../../utils/icons';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss'],
})
export class MenuButtonComponent implements OnInit {
  @Input()
  menuId = 'first';

  isOpen = false;
  icon = menuIcon;

  constructor(private menuCtrl: MenuController) {}

  ngOnInit() {
    this.menuCtrl.enable(true, this.menuId);
  }

  actionMenu() {
    this.menuCtrl.isOpen().then((res) => {
      this.menuCtrl.close(this.menuId);
      return;
    });
    this.menuCtrl.open(this.menuId);
  }
}
