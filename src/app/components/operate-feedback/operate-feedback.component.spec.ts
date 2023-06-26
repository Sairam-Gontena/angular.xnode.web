import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperateFeedbackComponent } from './operate-feedback.component';

describe('OperateFeedbackComponent', () => {
  let component: OperateFeedbackComponent;
  let fixture: ComponentFixture<OperateFeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperateFeedbackComponent]
    });
    fixture = TestBed.createComponent(OperateFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
