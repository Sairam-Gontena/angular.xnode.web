import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFlow2Component } from './ui-flow2.component';

describe('UiFlow2Component', () => {
  let component: UiFlow2Component;
  let fixture: ComponentFixture<UiFlow2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiFlow2Component]
    });
    fixture = TestBed.createComponent(UiFlow2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
