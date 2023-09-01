import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAlertPopupComponent } from './product-alert-popup.component';

describe('ProductAlertPopupComponent', () => {
  let component: ProductAlertPopupComponent;
  let fixture: ComponentFixture<ProductAlertPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductAlertPopupComponent]
    });
    fixture = TestBed.createComponent(ProductAlertPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
