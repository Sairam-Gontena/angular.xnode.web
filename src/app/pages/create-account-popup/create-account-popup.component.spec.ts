import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountPopupComponent } from './create-account-popup.component';

describe('CreateAccountPopupComponent', () => {
  let component: CreateAccountPopupComponent;
  let fixture: ComponentFixture<CreateAccountPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAccountPopupComponent]
    });
    fixture = TestBed.createComponent(CreateAccountPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
