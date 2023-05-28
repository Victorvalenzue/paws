import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit {
  @Input()
  button = false;

  @Input()
  uploaded = false;

  @Input()
  disabled = false;

  @Input()
  fab = false;

  @Input()
  icon = false;

  @Input()
  working = false;

  @Input()
  types = '';

  @Output()
  fileSelected = new EventEmitter<File>();

  @ViewChild('inputFile')
  inputFile: ElementRef | undefined;

  name = '';

  constructor() {}

  ngOnInit() {}

  uploadFile(event: any): void {
    if (!event) {
      return;
    }
    if (!event.target) {
      return;
    }
    const files = event.target.files;

    if (!files || !files.length) {
      return;
    }

    const file = files[0];

    this.name = file.name;
    this.fileSelected.next(file);
    this.uploaded = true;
  }

  reset() {
    if (!this.uploaded) {
      return;
    }

    if (!this.inputFile) {
      return;
    }

    this.inputFile.nativeElement.value = '';
    this.name = '';
    this.uploaded = false;
  }
}
