import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffListComponent } from './diff-list.component';

describe('DiffListComponent', () => {
  let component: DiffListComponent;
  let fixture: ComponentFixture<DiffListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiffListComponent]
    });
    fixture = TestBed.createComponent(DiffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
