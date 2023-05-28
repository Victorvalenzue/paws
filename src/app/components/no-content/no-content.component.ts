import { Component, Input, OnInit } from '@angular/core';

import { NavigationService } from '../../services/navigation.service';

type NoContentInformation = {
  image: string;
  title: string;
  subtitle: string;
  link: string;
  linkText: string;
};

@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.scss'],
})
export class NoContentComponent implements OnInit {
  @Input()
  information: NoContentInformation | undefined;

  constructor(private navigation: NavigationService) {}

  ngOnInit() {}

  goto(link: string) {
    this.navigation.navigateByUrl(link);
  }
}
