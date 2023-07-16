import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErModellerComponent } from './er-modeller.component';

describe('ErModellerComponent', () => {
  let component: ErModellerComponent;
  let fixture: ComponentFixture<ErModellerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErModellerComponent]
    });
    fixture = TestBed.createComponent(ErModellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
