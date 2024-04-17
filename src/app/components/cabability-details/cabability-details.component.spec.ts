import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CababilityDetailsComponent } from './cabability-details.component';

describe('CababilityDetailsComponent', () => {
  let component: CababilityDetailsComponent;
  let fixture: ComponentFixture<CababilityDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CababilityDetailsComponent]
    });
    fixture = TestBed.createComponent(CababilityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
