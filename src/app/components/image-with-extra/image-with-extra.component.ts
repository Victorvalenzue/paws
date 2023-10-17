import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-with-extra',
  templateUrl: './image-with-extra.component.html',
  styleUrls: ['./image-with-extra.component.scss'],
})
export class ImageWithExtraComponent implements OnInit {
  @Input() title: string = '';
  @Input() subtitile: string = '';
  @Input() image: string = '';
  expanded = false;

  constructor() {}

  ngOnInit() {}
}
