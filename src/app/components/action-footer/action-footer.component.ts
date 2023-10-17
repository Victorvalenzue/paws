import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-action-footer',
  templateUrl: './action-footer.component.html',
  styleUrls: ['./action-footer.component.scss'],
})
export class ActionFooterComponent implements OnInit {
  @Input() static = true;
  @Input() withBorder = true;
  @Input() marginBottom = false;
  @Input() end = false;
  @Input() customClass = '';
  classes = `button-section ${this.withBorder ? 'bordered' : ''} ${this.end ? 'end' : ''} ${this.customClass}`;

  constructor() {}

  ngOnInit() {
    this.classes = `button-section ${this.withBorder ? 'bordered' : ''} ${this.end ? 'end' : ''} ${this.customClass}`;
  }
}
