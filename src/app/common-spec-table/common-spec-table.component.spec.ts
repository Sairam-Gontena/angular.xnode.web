import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSpecTableComponent } from './common-spec-table.component';

describe('CommonSpecTableComponent', () => {
  let component: CommonSpecTableComponent;
  let fixture: ComponentFixture<CommonSpecTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonSpecTableComponent]
    });
    fixture = TestBed.createComponent(CommonSpecTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
