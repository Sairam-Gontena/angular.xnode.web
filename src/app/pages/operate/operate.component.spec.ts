import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperateComponent } from './operate.component';

describe('OperateComponent', () => {
  let component: OperateComponent;
  let fixture: ComponentFixture<OperateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperateComponent]
    });
    fixture = TestBed.createComponent(OperateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
