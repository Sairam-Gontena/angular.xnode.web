import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCapabilityModalComponent } from './create-capability-modal.component';

describe('CreateCapabilityModalComponent', () => {
  let component: CreateCapabilityModalComponent;
  let fixture: ComponentFixture<CreateCapabilityModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCapabilityModalComponent]
    });
    fixture = TestBed.createComponent(CreateCapabilityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
