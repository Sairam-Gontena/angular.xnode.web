import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationsHeaderComponent } from './specifications-header.component';

describe('SpecificationsHeaderComponent', () => {
  let component: SpecificationsHeaderComponent;
  let fixture: ComponentFixture<SpecificationsHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationsHeaderComponent]
    });
    fixture = TestBed.createComponent(SpecificationsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
