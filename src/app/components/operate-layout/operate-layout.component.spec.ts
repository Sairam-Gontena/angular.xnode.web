import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperateLayoutComponent } from './operate-layout.component';

describe('OperateLayoutComponent', () => {
  let component: OperateLayoutComponent;
  let fixture: ComponentFixture<OperateLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperateLayoutComponent]
    });
    fixture = TestBed.createComponent(OperateLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
