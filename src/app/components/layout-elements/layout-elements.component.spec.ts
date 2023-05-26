import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutElementsComponent } from './layout-elements.component';

describe('LayoutElementsComponent', () => {
  let component: LayoutElementsComponent;
  let fixture: ComponentFixture<LayoutElementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutElementsComponent]
    });
    fixture = TestBed.createComponent(LayoutElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
