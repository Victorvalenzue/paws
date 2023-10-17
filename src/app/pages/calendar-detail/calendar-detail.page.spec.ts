import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarDetailPage } from './calendar-detail.page';

describe('CalendarDetailPage', () => {
  let component: CalendarDetailPage;
  let fixture: ComponentFixture<CalendarDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CalendarDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
