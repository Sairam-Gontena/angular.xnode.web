import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErGeneratorLayoutComponent } from './er-generator-layout.component';

describe('ErGeneratorLayoutComponent', () => {
  let component: ErGeneratorLayoutComponent;
  let fixture: ComponentFixture<ErGeneratorLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErGeneratorLayoutComponent]
    });
    fixture = TestBed.createComponent(ErGeneratorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
