import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandGuidelinesComponent } from './brand-guidelines.component';

describe('BrandGuidelinesComponent', () => {
  let component: BrandGuidelinesComponent;
  let fixture: ComponentFixture<BrandGuidelinesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrandGuidelinesComponent]
    });
    fixture = TestBed.createComponent(BrandGuidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
