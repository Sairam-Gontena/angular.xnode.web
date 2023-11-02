import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationalertComponent } from './confirmationalert.component';

describe('ConfirmationalertComponent', () => {
  let component: ConfirmationalertComponent;
  let fixture: ComponentFixture<ConfirmationalertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationalertComponent]
    });
    fixture = TestBed.createComponent(ConfirmationalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
