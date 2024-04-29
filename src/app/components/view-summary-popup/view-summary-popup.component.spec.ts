import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSummaryPopupComponent } from './view-summary-popup.component';

describe('ViewSummaryPopupComponent', () => {
  let component: ViewSummaryPopupComponent;
  let fixture: ComponentFixture<ViewSummaryPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSummaryPopupComponent]
    });
    fixture = TestBed.createComponent(ViewSummaryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
