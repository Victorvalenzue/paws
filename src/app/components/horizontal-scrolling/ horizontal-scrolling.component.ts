import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-horizontal-scrolling',
  templateUrl: './horizontal-scrolling.component.html',
  styleUrls: ['./horizontal-scrolling.component.scss'],
})
export class HorizontalScrollingComponent implements OnInit {
  @Input() title = '';

  constructor() {}

  ngOnInit() {}
}
