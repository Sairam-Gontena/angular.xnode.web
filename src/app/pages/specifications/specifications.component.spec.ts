import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationsComponent } from './specifications.component';

describe('SpecificationsComponent', () => {
  let component: SpecificationsComponent;
  let fixture: ComponentFixture<SpecificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationsComponent]
    });
    fixture = TestBed.createComponent(SpecificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
