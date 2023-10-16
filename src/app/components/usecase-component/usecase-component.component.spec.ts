import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsecaseComponentComponent } from './usecase-component.component';

describe('UsecaseComponentComponent', () => {
  let component: UsecaseComponentComponent;
  let fixture: ComponentFixture<UsecaseComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsecaseComponentComponent]
    });
    fixture = TestBed.createComponent(UsecaseComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
