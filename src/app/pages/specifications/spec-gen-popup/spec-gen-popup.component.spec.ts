import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecGenPopupComponent } from './spec-gen-popup.component';

describe('SpecGenPopupComponent', () => {
  let component: SpecGenPopupComponent;
  let fixture: ComponentFixture<SpecGenPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecGenPopupComponent]
    });
    fixture = TestBed.createComponent(SpecGenPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
