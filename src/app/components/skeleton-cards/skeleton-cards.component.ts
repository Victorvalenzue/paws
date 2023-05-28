import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-cards',
  templateUrl: './skeleton-cards.component.html',
  styleUrls: ['./skeleton-cards.component.scss'],
})
export class SkeletonCardsComponent implements OnInit {
  @Input() visible = true;
  @Input() quantity = 5;

  cards: number[] = [];

  constructor() {
    for (let index = 0; index < this.quantity; index++) {
      this.cards.push(index);
    }
  }

  ngOnInit() {}
}
