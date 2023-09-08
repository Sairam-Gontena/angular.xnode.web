import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitReachedPopupComponent } from './limit-reached-popup.component';

describe('LimitReachedPopupComponent', () => {
  let component: LimitReachedPopupComponent;
  let fixture: ComponentFixture<LimitReachedPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LimitReachedPopupComponent]
    });
    fixture = TestBed.createComponent(LimitReachedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
