import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent {
  @Input() disabled: boolean;

  @Input() list: any[] = [];

  @Output() focusEvent = new EventEmitter<boolean>();

  @Output() blurEvent = new EventEmitter<boolean>();

  @Output() filterEvent = new EventEmitter<string>();

  constructor() {}

  onSearch($event: any) {
    const searchTerm = $event.detail.value
    this.filterEvent.emit(searchTerm);
  }

  onFocus() {
    this.focusEvent.emit(true);
  }

  onBlur() {
    this.blurEvent.emit(true);
  }
}
