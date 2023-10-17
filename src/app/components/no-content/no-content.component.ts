import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NavigationService } from '../../services/navigation.service';

type NoContentInformation = {
  image: string;
  title: string;
  subtitle: string;
  link: string;
  linkText: string;
  action: boolean;
};

@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.scss'],
})
export class NoContentComponent implements OnInit {
  @Input()
  small = false;
  
  @Input()
  information: NoContentInformation | undefined;

  @Output()
  action = new EventEmitter<string>();

  constructor(private navigation: NavigationService) {}

  ngOnInit() {}

  goto(link: string) {
    this.navigation.navigateByUrl(link);
  }

  doAction() {
    this.action.emit('');
  }
}
