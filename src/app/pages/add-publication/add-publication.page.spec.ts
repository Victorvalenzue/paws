import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPublicationPage } from './add-publication.page';

describe('AddPublicationPage', () => {
  let component: AddPublicationPage;
  let fixture: ComponentFixture<AddPublicationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddPublicationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
