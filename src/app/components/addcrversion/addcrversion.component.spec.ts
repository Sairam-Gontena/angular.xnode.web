import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcrversionComponent } from './addcrversion.component';

describe('AddcrversionComponent', () => {
  let component: AddcrversionComponent;
  let fixture: ComponentFixture<AddcrversionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddcrversionComponent]
    });
    fixture = TestBed.createComponent(AddcrversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
