import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() title = '';
  @Input() overtitle?: string | number;
  @Input() subtitle?: string;
  @Input() badge?: string | number;
  @Input() tapable = false;
  @Input() withBody = false;
  @Input() withFooter = false;
  @Input() withBorder = false;
  @Input() color?:
    | 'light'
    | 'orange'
    | 'green'
    | 'cute-blue'
    | 'pamela'
    | 'glass'
    | 'obscure'
    | 'love'
    | 'young'
    | 'fire'
    | 'default' = 'default';
  @Input() cardClass = '';
  @Output() action = new EventEmitter<boolean>();

  cardClasses = `rounded-card ${this.color} ${this.cardClass}`;
  wrapperClasses = `card-wrapper ${this.withBorder ? 'bordered' : ''}`;

  constructor() {}

  ngOnInit() {
    this.cardClasses = `rounded-card ${this.color} ${this.cardClass}`;
    this.wrapperClasses = `card-wrapper ${this.withBorder ? 'bordered' : ''}`;
  }

  clickCard() {
    this.action.emit(true);
  }
}
