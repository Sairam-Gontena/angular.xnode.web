import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationsMenuComponent } from './specifications-menu.component';

describe('SpecificationsMenuComponent', () => {
  let component: SpecificationsMenuComponent;
  let fixture: ComponentFixture<SpecificationsMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationsMenuComponent]
    });
    fixture = TestBed.createComponent(SpecificationsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
