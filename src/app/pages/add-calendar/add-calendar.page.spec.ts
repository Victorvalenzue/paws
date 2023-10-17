import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCalendarPage } from './add-calendar.page';

describe('AddCalendarPage', () => {
  let component: AddCalendarPage;
  let fixture: ComponentFixture<AddCalendarPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
