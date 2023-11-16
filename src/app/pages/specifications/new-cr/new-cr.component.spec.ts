import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCrComponent } from './new-cr.component';

describe('NewCrComponent', () => {
  let component: NewCrComponent;
  let fixture: ComponentFixture<NewCrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCrComponent]
    });
    fixture = TestBed.createComponent(NewCrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
