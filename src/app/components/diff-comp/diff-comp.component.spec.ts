import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffCompComponent } from './diff-comp.component';

describe('DiffCompComponent', () => {
  let component: DiffCompComponent;
  let fixture: ComponentFixture<DiffCompComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiffCompComponent]
    });
    fixture = TestBed.createComponent(DiffCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
