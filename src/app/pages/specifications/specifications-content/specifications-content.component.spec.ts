import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationsContentComponent } from './specifications-content.component';

describe('SpecificationsContentComponent', () => {
  let component: SpecificationsContentComponent;
  let fixture: ComponentFixture<SpecificationsContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationsContentComponent]
    });
    fixture = TestBed.createComponent(SpecificationsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
