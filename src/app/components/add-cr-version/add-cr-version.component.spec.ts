import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrVersionComponent } from './add-cr-version.component';

describe('AddCrVersionComponent', () => {
  let component: AddCrVersionComponent;
  let fixture: ComponentFixture<AddCrVersionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCrVersionComponent]
    });
    fixture = TestBed.createComponent(AddCrVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
