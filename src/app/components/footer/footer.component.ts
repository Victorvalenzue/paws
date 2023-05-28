import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @Input() complement = '';
  @Input() link = '';
  @Input() linkReadable = '';

  today = new Date();

  constructor() {}

  ngOnInit() {}
}
