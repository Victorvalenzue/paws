import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-card',
  templateUrl: './tab-card.component.html',
  styleUrls: ['./tab-card.component.scss'],
})
export class TabCardComponent implements OnInit {
  @Input() subtitle?: string;
  @Input() tapable = false;
  @Input() color?: 'light' | 'orange' | 'green' | 'cute-blue' | 'pamela' | 'love' | 'young' | 'fire' | 'default' =
    'default';
  headerClasses = `tab-card-header ${this.color}`;

  constructor() {}

  ngOnInit() {
    this.headerClasses = `tab-card-header ${this.color}`;
  }
}
