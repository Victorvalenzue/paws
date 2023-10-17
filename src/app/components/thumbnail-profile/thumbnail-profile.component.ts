import { Component, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { PROFILE } from 'src/utils/assets';

@Component({
  selector: 'app-thumbnail-profile',
  templateUrl: './thumbnail-profile.component.html',
  styleUrls: ['./thumbnail-profile.component.scss'],
})
export class ThumbnailProfileComponent implements OnInit {
  defaultImage = PROFILE;

  @Input()
  source: string | SafeUrl = this.defaultImage;
  @Input()
  small = false;
  @Input()
  dark = false;

  constructor() {}

  ngOnInit() {}
}
