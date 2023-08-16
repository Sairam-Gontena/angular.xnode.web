import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicControlComponent } from './dynamic-control.component';

describe('DynamicControlComponent', () => {
  let component: DynamicControlComponent;
  let fixture: ComponentFixture<DynamicControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicControlComponent]
    });
    fixture = TestBed.createComponent(DynamicControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
